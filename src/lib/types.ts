import { FastifyRequest } from 'fastify'

// import fastify from 'fastify'

export interface reqDecorado extends FastifyRequest {
	email?: string
	superAdmin?: boolean
}

declare module 'fastify' {
	export interface FastifyRequest {
		email?: string
		superAdmin?: boolean
	}
}