import { FastifyPluginAsync } from 'fastify'


const instituciones: FastifyPluginAsync = async (fastify): Promise<void> => {
	fastify.post<{ Body: institucionesBody }>('/', async function (request, reply) {
		
	})
}