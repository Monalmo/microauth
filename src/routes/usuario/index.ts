import { FastifyPluginAsync } from 'fastify'
// import { ObjectId } from 'mongodb'
import usuariosService from '../../db/usuarios'
import { confirmacionConCodigoBody, confirmacionCorreoOpt, registroBody, registroOpt } from './types'
import { projection } from '@/db/dbTypes'
import validador from '@lib/validador'
import _ from 'lodash'

const usuario: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post<{ Body: registroBody }>('/', registroOpt, async function (request, reply) {
		console.log('body: ', request.body)

		const nombre = request.body.nombre
		const email = request.body.email
		const pass = request.body.pass

		try {
			validador.string(nombre, 'nombre')
			validador.email(email, 'email')
		} catch (error) {
			const key = Object.keys(error[1])
			const mensaje = _.get(error[1], key)
			console.log(mensaje)
			return reply.send({ ok: 0, error: `${key} ${mensaje}` })
		}

		const projection: projection = {
			email: 1
		}

		const emailExistente = await usuariosService.obtenerXEmail(email, projection)
		if (emailExistente) {
			return reply.send({
				ok: 0,
				mensaje: 'El email ya existe'
			})
		}
		const usuario = await usuariosService.crear(nombre, email, pass)
		console.log('usuarioEncontrado: ', usuario)

		return reply.send({ ok: 1, mensaje: 'Usuario creado exitosamente, debe confirmar su correo electronico' })
	})

	
	fastify.post<{ Body: confirmacionConCodigoBody }>('/confirmacionCorreo/conCodigo', confirmacionCorreoOpt, async function (request, reply) {
		const email = request.body.email
		const codigo = request.body.codigo

		try {
			validador.email(email, 'email')
			validador.string(codigo, 'codigo')
		} catch (error) {
			const key = Object.keys(error[1])
			const mensaje = _.get(error[1], key)
			console.log(mensaje)
			return reply.send({ ok: 0, error: `${key} ${mensaje}` })
		}

		try {
			const codigoValidado = await usuariosService.validarCodigoConfirmacion(email, codigo)
			if (codigoValidado !== 'validado') { 
				const errorMessage = `Error: ${codigoValidado.intentosFallidos} intentos fallidos`
				return reply.send({ ok: 0, error: errorMessage}) 
			}
			return reply.send({ ok: 1, mensaje: codigoValidado })
		} catch (error) {
			return reply.send({ ok: 0, error: error })
		}
	})
}

export default usuario
