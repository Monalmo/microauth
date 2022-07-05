import { Type, Static } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'

const registroCorreo = Type.Object({
	SMTPUsername: Type.String(),
	SMTPPassword: Type.String(),
	dominio: Type.String(),
})

const registroResponse = Type.Object({
	ok: Type.Boolean(),
	mensaje: Type.Optional(Type.String()),
	error: Type.Optional(Type.String())
})

export const registroOpt: RouteShorthandOptions = {
	schema: {
		body: registroCorreo,
		response: {
			200: registroResponse
		}
	}
}

export type registroBody = Static<typeof registroCorreo>
