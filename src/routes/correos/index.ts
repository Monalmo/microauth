import { FastifyPluginAsync } from 'fastify'
import validador from '@lib/validador'
import _ from 'lodash'
import { registroBody, registroOpt } from './types'
import { guardarCredencialesCorreo } from '@/correos/db'

const usuario: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post<{ Body: registroBody }>('/credenciales', registroOpt, async function (request, reply) {
		console.log('body: ', request.body)

		const SMTPUsername = request.body.SMTPUsername
		const SMTPPassword = request.body.SMTPPassword
		const dominio = request.body.dominio

		try {
			validador.string(SMTPUsername, 'SMTPUsername')
			validador.string(SMTPPassword, 'SMTPPassword')
			validador.string(dominio, 'dominio')
		} catch (error) {
			const key = Object.keys(error[1])
			const mensaje = _.get(error[1], key)
			console.log(mensaje)
			return reply.send({ ok: 0, error: `${key} ${mensaje}` })
		}

		await guardarCredencialesCorreo(SMTPUsername, SMTPPassword, dominio)


		return reply.send({ ok: 1, mensaje: 'Credenciales SMTP guardadas' })
	})
}

export default usuario
