/* eslint-disable no-useless-catch */
import { ObjectID } from 'bson'
import DB from '@lib/db'



export interface direccionCompleta {
	region: string
	comuna: string
	direccion: string
	complemento: string | null
}
export interface datos {
	nombre: string
	nombreCorto: string
	IDFiscal: string
	pais: string
	direccion: direccionCompleta
}
export interface representanteLegal {
	nombre: string
	identificacion: string
	email: string
	telefono: string
}
export interface usuariosOrg {
	[usuarioID: string]: {
		isOwner: boolean
		isAdmin: boolean
		nombre: string
		activo: boolean
		creadoPor: ObjectID | string
		fecha: Date
	}
}
export interface monedas {
	USD: number
	CLP: number
}
export interface fondos {
	[fondoID: string]: {
		nombre: string
		monedas: monedas
	}
}
export interface creacion {
	creadaPor: ObjectID | string
	fecha: Date
}
export interface habilitada {
	activa: boolean
	habilitadaPor: ObjectID
	fecha: Date
}
export interface solicitud {
		montoCLP: number
		tipoCambio: number
		montoUSD: number
		realizadaPor: ObjectID | string
		fecha: Date
}
export interface recargasPendiente {
	[idRecarga: string]: solicitud
}
export interface recarga {
	id: string
	montoRecarga: number
	recargadoPor: ObjectID | string
	fecha: Date
	solicitud: solicitud
}

export interface organizacion {
	_id: ObjectID | string
	datos?: datos
	representanteLegal?: representanteLegal
	usuarios?: usuariosOrg
	fondos?: fondos
	creacion?: creacion
	cardholderID?: string
	habilitada?: habilitada
	recargasPendiente?: recargasPendiente
	recargas?: [recarga]
}

export const organizacionesService = {
	async obtener (orgID: ObjectID) {
		const fx = 'obtener organizacion'
		console.log(fx, orgID)

		try {
			const db = await DB('eperk-test')
			const organizacion: organizacion = await db.collection('organizaciones').findOne({ _id: orgID })
			console.log(fx, organizacion)
			return organizacion
		} catch (error) {
			console.log('error obteniendo organizacion ', {error})
			throw error
		}
	}
}
