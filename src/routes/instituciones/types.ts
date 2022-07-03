import { Type } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'

enum ministerios {
	'MINSEGEGOB',
	'MINSAL',
	'MINVU',
	'MINEDUC',
	'HACIENDA'
}

const institucionRequest: object = Type.Object({
	ministerio: Type.Enum(ministerios),
	departamento: Type.Optional(Type.String()),
	usuariosIndependientes: Type.Boolean()
})

const institucionResponse = Type.Object({
	ok: Type.Boolean(),
	mensaje: Type.String()
})

export const usuariosOpt: RouteShorthandOptions = {
	schema: {
		body: institucionRequest,
		response: {
			200: institucionResponse
		}
	}
}
// export type usuarioBody = Static<typeof usuarioRequest>

export interface usuarioBody {
	usuario: string
}
