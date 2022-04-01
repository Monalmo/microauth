import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get('/', async function () {
		return { hjh: 'aca se entrega un usuario' }
	})
}

export default example
