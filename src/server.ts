import chalk from 'chalk'
import { fastify } from 'fastify'

import fastifyXmlBodyParser from 'fastify-xml-body-parser'
import fastifyRoutes from 'fastify-routes'
import pino from 'pino'
import appService from './app'

const start = async () => {
	const server = fastify({
		logger: pino({
			// https://github.com/pinojs/pino/blob/master/docs/api.md#level-string
			level: 'info',
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'mmm-d HH:MM:ss,l o',
				},
			},
		}),
	})

	try {
		server.register(fastifyRoutes)
		server.register(fastifyXmlBodyParser)

		server.addHook('onRequest', function (request, reply, done) {
			console.log(chalk.cyan('Request!!'), request.url)

			// console.log(request);
			return done()
		})

		server.addHook('preValidation', function (request, reply, done) {
			console.log(chalk.blue('Body'), request.body)

			// console.log(request);
			return done()
		})

		server.register(appService)

		server.setErrorHandler(function (error, request, reply) {
			// Log error
			this.log.error(error)
			console.error(chalk.red('fastify Error'), error)
			// Send error response
			reply.status(409).send({ ok: false })
		})

		const port = process.env.PORT || 3080
		const ip = process.env.MODO === 'dev' ? '0.0.0.0' : '127.0.0.1'

		await server.listen(port, ip)

		console.log(chalk.magenta('Rutas'), server.routes)
		console.log('Server started successfully')
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}

export default start
export { start }
