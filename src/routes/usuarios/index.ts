import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post('/', async function (request, reply) {
		// console.log('body: ',request.body)

		return reply.send({ hjh: 'aca se entrega un usuario' })
	})
}

export default example
