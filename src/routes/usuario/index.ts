import { FastifyPluginAsync } from 'fastify'
// import { ObjectId } from 'mongodb'
import usuariosService from '../../db/usuarios'
import { registroBody, registroOpt } from './types'
import { projection } from '@/db/dbTypes'
import validador from '@lib/validador'
import _ from 'lodash'

const usuario: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post<{ Body: registroBody }>('/', registroOpt, async function (request, reply) {
		console.log('body: ', request.body)
		const nombre = request.body.nombre
		const email = request.body.email

		try {
			validador.string(nombre, 'nombre')
			console.log('nombre validado', validador.string(nombre, 'nombre'))
			validador.email(email, 'email')

		} catch (error) {
			const key = Object.keys(error[1])
			const mensaje = _.get(error[1], key)
			console.log(mensaje)
			reply.send({ ok: 0, error: `${key} ${mensaje}` })
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
		const usuario = await usuariosService.crear(nombre, email)
		console.log('usuarioEncontrado: ', usuario)

		return reply.send({ ok: 1, mensaje: 'Usuario creado exitosamente' })
	})
}

export default usuario
