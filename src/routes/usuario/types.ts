import { Type, Static } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'


const registroRequest = Type.Object({
	nombre: Type.String(),
	email: Type.String()
})

const registroResponse = Type.Object({
	ok: Type.Boolean(),
	mensaje: Type.Optional(Type.String()),
	error: Type.Optional(Type.String())
})

export const registroOpt: RouteShorthandOptions = {
	schema: {
		body: registroRequest,
		response: {
			200: registroResponse
		}
	}
}

export type registroBody = Static<typeof registroRequest>

