import { Request } from 'express'
import { ApoderadeModel } from '../db/apoderades'

export interface Token {
	sub: 'x81F9nm1As1w' // ID de usuario tanto en microservicio como en back
	llaves: {
		firma: {
			publica: string
		}
		encriptacion: {
			publica: string
		}
	}
}

export interface ReqWithToken extends Request {
	llaveroBack: any
	llaveroCuentas: any
	llaveroCliente: any
	token: Token
	Cuenta: any
	usuarioID: string
	Origin: string
	Host: string
	apoderade: ApoderadeModel
}
