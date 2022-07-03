import { Type, Static } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'


const organizacionRequest = Type.Object({
	organizacion: Type.String(),
	email: Type.String()
})

const organizacionResponse = Type.Object({
	ok: Type.Boolean(),
	mensaje: Type.String()
})

export const usuariosOpt: RouteShorthandOptions = {
	schema: {
		body: organizacionRequest,
		response: {
			200: organizacionResponse
		}
	}
}
export type organizacionBody = Static<typeof organizacionRequest>

