import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { activarBeneficioBody } from './types'
import _ from 'lodash'
import { organizacionesService } from '@/db/organizaciones'
import { ObjectId } from 'mongodb'

const beneficios: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post<{ Body: activarBeneficioBody }>(
		'/activar',
		async function (request: FastifyRequest, reply: FastifyReply) {
			console.log('body: ', request.body)
			const activar: boolean = _.get(request, ['body', 'activar'])
			// console.log('body2: ', body)
			const orgID = new ObjectId('6285d5cca833f4f755b748be')
			const servicioActivado = await organizacionesService.obtener(orgID)

			// const {usuario} = req.body
			// const usuarioEncontrado = await usuariosService.perfiles.usuarioXusuarioID(usuario)
			console.log('/activar: ', { servicioActivado, activar })

			return reply.send({ ok: 1, hjh: 'aca se entrega un usuario' })
		}
	)
}

export default beneficios
