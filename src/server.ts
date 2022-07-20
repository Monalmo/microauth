import chalk from 'chalk'
import { fastify } from 'fastify'
import fastifyRoutes from '@fastify/routes'
import fastifyCors from '@fastify/cors'
import fastifyHelmet from '@fastify/helmet'

import fastifyXmlBodyParser from 'fastify-xml-body-parser'
// import fastifyRoutes from 'fastify-routes'
import pino from 'pino'
import appService from './app'
import _ from 'lodash'
import { verificarToken } from './auth/ingreso'
import { reqDecorado } from '@lib/types'

const start = async () => {
	const server = fastify({
		logger: pino({
			// https://github.com/pinojs/pino/blob/master/docs/api.md#level-string
			level: 'info',
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'mmm-d HH:MM:ss,l o'
				}
			}
		})
	})

	try {
		server.register(fastifyHelmet, { global: true })
		server.register(fastifyCors, {
			origin: (origin, cb) => {
				// const hostname = new URL(origin).hostname
				console.log('origin: ', chalk.cyan(origin))
				if (origin) {
					const hostname = new URL(origin).hostname
					console.log('origin: ', chalk.cyan(hostname))
					//  Request from localhost will pass
					cb(null, true)
					return
				}
				console.log('Sin Origin: ', chalk.cyan(origin))
				cb(null, true)
				return
				// Generate an error on other origins, disabling access
				// cb(new Error('No permitido'), true)
			}
		})
		server.register(fastifyRoutes)
		server.register(fastifyXmlBodyParser)

		server.addHook('onRequest', function (request, reply, done) {
			console.log('SOLICITUD', chalk.cyan(request.method), chalk.yellow(request.url))
			// if (request.method === 'POST' && )
			// console.log(request);
			return done()
		})

		server.addHook('preValidation', async function (request: reqDecorado, reply) {
			console.log(chalk.blue('preValidation - Body'), request.body)

			const ruta = request.url
			const rutasLibres = ['/login']

			if (!_.isEmpty(_.filter(rutasLibres, r => {
				if (r === ruta) return r
			}))) {
				console.log(`Ruta ${ruta} sin validacion de token`)

				return
			}
			console.log(`Ruta ${ruta} con validacion de token`)
			const token = request.headers.authorization
			console.log('header', token)

			const tokenValidado = await verificarToken(token)
			console.log('tokenValidado', tokenValidado)

			if (!tokenValidado) {
				return reply.send({ ok: 0, error: 'Token invalido' })
			}
			request.email = tokenValidado.email

			return
		})

		server.register(appService)

		server.setErrorHandler(function (error, request, reply) {
			// Log error
			this.log.error(error)
			console.error(chalk.red('fastify Error'), error)
			// Send error response
			reply.status(400).send({ ok: 0, error: error.message })
		})

		const port = process.env.PORT || 3080
		const ip = process.env.MODO === 'dev' ? '0.0.0.0' : '127.0.0.1'

		console.log('Server iniciando en', chalk.cyan(`http://${ip}:${port}`))
		await server.listen(port, ip)

		interface Ruta {
			path: string
			method: string
			url: string
		}
		const rutasComoTabla: Ruta[] = []

		for (const [path, rutas] of server.routes) {
			for (const ruta of rutas) {
				rutasComoTabla.push({
					path,
					method: ruta.method.toString(),
					url: ruta.url
				})
			}
		}
		// console.log(chalk.magenta('Rutas'), server.routes)
		console.log(chalk.cyan('Server iniciado en '), chalk.cyanBright.bold(`${ip}:${port}\n`))
		console.table(rutasComoTabla)
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}

start()

export default start
export { start }
