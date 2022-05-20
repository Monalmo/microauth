import { Type } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'

const usuarioRequest: object = Type.object({
	usuario: Type.toString()
})

const usuarioResponse = Type.Object({
	ok: Type.Boolean(),
	usuario: Type.Object()
})

export const usuariosOpt: RouteShorthandOptions = {
	schema: {
		Body: usuarioRequest,
		response: {
			200: usuarioResponse
		}
	}
}
// export type usuarioBody = Static<typeof usuarioRequest>

export interface usuarioBody {
	usuario: string
}
