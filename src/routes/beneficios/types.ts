import { Type } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'

const activarBeneficioReq: object = Type.object({
	activar: Type.Boolean()
})

const activarBeneficioResponse = Type.Object({
	ok: Type.Boolean(),
	mensaje: Type.String()
})

export const activarBeneficiosOpt: RouteShorthandOptions = {
	schema: {
		Body: activarBeneficioReq,
		response: {
			200: activarBeneficioResponse
		}
	}
}
export type activarBeneficioBody = Static<typeof activarBeneficioReq>

// export interface activarBeneficioBody {
// 	usuario: string
// }
