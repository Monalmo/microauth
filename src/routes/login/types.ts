import { Type, Static } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'

const loginReq = Type.Object({
	email: Type.String(),
	pass: Type.String()
})

const loginResponse = Type.Object({
	ok: Type.Boolean(),
	token: Type.Optional(Type.String()),
	error: Type.Optional(Type.String())
})

export const loginOpt: RouteShorthandOptions = {
	schema: {
		body: loginReq,
		response: {
			200: loginResponse
		}
	}
}

export type loginBody = Static<typeof loginReq>