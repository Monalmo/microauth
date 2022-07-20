import { FastifyPluginAsync } from 'fastify'
// import { ObjectId } from 'mongodb'
import usuariosService from '../../db/usuarios'
import { asignarWebBody, asignarWebOpt, asignarWebParams, confirmacionConCodigoBody, confirmacionCorreoOpt, registroBody, registroOpt } from './types'
import { projection } from '@/db/dbTypes'
import validador from '@lib/validador'
import _ from 'lodash'
import { ObjectId } from 'mongodb'

const usuario: FastifyPluginAsync = async (fastify): Promise<void> => {
	// creacion de nuevo usuario, para acceder debe validar su correo
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

	// confirma contraseña creada por el usuario con el codigo enviado al correo
	fastify.post<{ Body: confirmacionConCodigoBody }>(
		'/confirmacionCorreo/conCodigo',
		confirmacionCorreoOpt,
		async function (request, reply) {
			const email = request.body.email
			const codigo = request.body.codigo

			// validaciones de entrada
			try {
				validador.email(email, 'email')
				validador.string(codigo, 'codigo')
			} catch (error) {
				const key = Object.keys(error[1])
				const mensaje = _.get(error[1], key)
				console.log(mensaje)
				return reply.send({ ok: 0, error: `${key} ${mensaje}` })
			}

			// validaciones del codgigo de confirmacion
			try {
				const codigoValidado = await usuariosService.validarCodigoConfirmacion(email, codigo)
				if (codigoValidado !== 'validado') {
					const errorMessage = `Error: ${codigoValidado.intentosFallidos} intentos fallidos`
					return reply.send({ ok: 0, error: errorMessage })
				}
				return reply.send({ ok: 1, mensaje: codigoValidado })
			} catch (error) {
				return reply.send({ ok: 0, error: error })
			}
		}
	)

	// asigna web para administrar en CMS
	// FALTA VALIDAR PERMISOS DEL QUE DA PERMISOS
	fastify.post<{ Body: asignarWebBody, Params: asignarWebParams }>('/:usuarioID/web', asignarWebOpt, async function (request, reply) {

		const usuaioID = request.params.usuarioID
		const web = request.body.web
		const tipoAcceso = request.body.tipoAcceso

		// try de validaciones de entrada
		try {
			validador.string(usuaioID, 'usuaioID')
			validador.string(web, 'web')
			validador.string(tipoAcceso, 'tipoAcceso')
		} catch (error) {
			const key = Object.keys(error[1])
			const mensaje = _.get(error[1], key)
			console.log(mensaje)
			return reply.send({ ok: 0, error: `${key} ${mensaje}` })
		}

		// asignacion y validacion de permisos
		try {
			let projection: projection = {
				email: 1,
				administraciones: 1,
				superAdmin: 1
			}

			// obtiene usuario que solicita la asignacion
			const emailSolicitante = request.email
			const usuarioAsignador = await usuariosService.obtenerXEmail(emailSolicitante, projection)

			// si no es superAdmin valida que tenga permiso para administrar el sitio
			if (!usuarioAsignador.superAdmin) {

				const tieneAcceso = _.get(usuarioAsignador, `administraciones.${web}`)

				if (!tieneAcceso) return reply.send({ ok: 0, error: 'No tiene permisos para asignar en esta web' })
			
				if (tieneAcceso === 'editor') return reply.send({ ok: 0, error: 'No tiene permisos para asignar en esta web' })

			}

			projection = {
				_id: 1,
				email: 1,
			}

			const existeElUsuario = await usuariosService.obtenerXId(new ObjectId(usuaioID), projection)

			// valida que el usuario que se deasea asignar exista
			if (!existeElUsuario)  return reply.send({ ok: 0, mensaje: 'El usuario al que deseas asignar no existe' }) 

			// asigna los permisos al usuario
			const asignado = await usuariosService.asignarWeb(new ObjectId(usuaioID), web, tipoAcceso)

			if (!asignado) return reply.send({ ok: 0, mensaje: 'No se pudo asignar el usuario' })
			if (_.isEmpty(asignado.value)) return reply.send({ ok: 0, mensaje: 'No se pudo asignar el usuario' })

			return reply.send({ ok: 1, mensaje: 'Web asignada exitosamente' })
		} catch (error) {
			return reply.send({ ok: 0, error: error })
		}
			
		

	})


}

export default usuario
