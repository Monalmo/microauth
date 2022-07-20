import { accesos } from '@/db/usuarios'
import { Type, Static } from '@sinclair/typebox'

import { RouteShorthandOptions } from 'fastify'

const registroRequest = Type.Object({
	nombre: Type.String(),
	email: Type.String(),
	pass: Type.String()
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




const confirmacionCorreoConCodBody = Type.Object({
	codigo: Type.String(),
	email: Type.String()
})

const confirmacionCorreoResponse = Type.Object({
	ok: Type.Boolean(),
	mensaje: Type.Optional(Type.String()),
	error: Type.Optional(Type.String())
})

export const confirmacionCorreoOpt: RouteShorthandOptions = {
	schema: {
		body: confirmacionCorreoConCodBody,
		response: {
			200: confirmacionCorreoResponse
		}
	}
}

export type confirmacionConCodigoBody = Static<typeof confirmacionCorreoConCodBody>



const asignarWebReq = Type.Object({
	web: Type.String(),
	tipoAcceso: Type.String()
})

const asignarWebParams = Type.Object({
	usuarioID: Type.String(),
})

const asignarWebResponse = Type.Object({
	ok: Type.Boolean(),	
	mensaje: Type.Optional(Type.String()),
	error: Type.Optional(Type.String())
})

export const asignarWebOpt: RouteShorthandOptions = {
	schema: {
		body: asignarWebReq,
		params: asignarWebParams,
		response: {
			200: asignarWebResponse
		}
	}
}
export type asignarWebParams = Static<typeof asignarWebParams>
export type asignarWebBody = Static<typeof asignarWebReq>