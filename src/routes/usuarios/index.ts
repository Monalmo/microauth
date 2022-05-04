import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get('/', async function (request, reply) {
		// console.log(request)

		return reply.send({ hjh: 'aca se entrega un usuario' })
	})
}

export default example
