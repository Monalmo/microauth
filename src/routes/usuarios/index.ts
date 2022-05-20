import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
// import { ObjectId } from 'mongodb'
import usuariosService from '../../db/usuarios'
import { usuarioBody } from './types'
import _ from 'lodash'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post<{ Body: usuarioBody }>('/', async function (request: FastifyRequest, reply: FastifyReply) {
		console.log('body: ', request.body)
		const usuario: string = _.get(request, ['body', 'usuario'])
		// console.log('body2: ', body)

		// const {usuario} = req.body
		const usuarioEncontrado = await usuariosService.perfiles.usuarioXusuarioID(usuario)
		console.log('usuarioEncontrado: ', usuarioEncontrado)

		return reply.send({ ok: 1, hjh: 'aca se entrega un usuario' })
	})
}

export default example
