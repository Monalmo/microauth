import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.get('/', async function () {
		return 'this is comprobantes'
	})
	fastify.get('/cerrarMes', async function () {
		return 'this is cerrar mes in comprobantes'
	})
}

export default example
