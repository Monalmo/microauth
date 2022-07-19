import validador from '@lib/validador'
import { FastifyPluginAsync } from 'fastify'
import { loginBody, loginOpt } from './types'
import _ from 'lodash'
import usuariosService from '@/db/usuarios'
import { projection } from '@/db/dbTypes'
import bcrypt from 'bcrypt'
import { ingresoService } from '@/auth/ingreso'

const login: FastifyPluginAsync = async (fastify): Promise<void> => {
	// creacion de nuevo usuario, para acceder debe validar su correo
	fastify.post<{ Body: loginBody }>('/', loginOpt, async function (request, reply) {
		console.log('body: ', request.body)

		const email = request.body.email
		const pass = request.body.pass

		try {
			validador.email(email, 'email')
			validador.string(pass, 'pass')
		} catch (error) {
			const key = Object.keys(error[1])
			const mensaje = _.get(error[1], key)
			console.log(mensaje)
			return reply.send({ ok: 0, error: `${key} ${mensaje}` })
		}

		try {
			const projection: projection = {
				email: 1,
				pass: 1,
				_id: 1
			}
			const usuario = await usuariosService.obtenerXEmail(email, projection)
	
			if (!usuario)  return reply.send({ ok: 0, mensaje: 'El email no existe' }) 
	
			if (!usuario.pass)  return reply.send({ ok: 0, mensaje: 'El usuario no tiene contraseña' }) 
	
			const passCorrecto = await bcrypt.compare(pass, usuario.pass)
	
			if (!passCorrecto)  return reply.send({ ok: 0, mensaje: 'La contraseña es incorrecta' }) 
	
			const token = await ingresoService.tokenLogin(usuario.email)
			console.log('token: ', token)
	
			return reply.send({ ok: 1, token })
		} catch (error) {
			console.error(error)
			return reply.send({ ok: 0, error: 'Error al ingresar' })
		}

	})

}

export default login
