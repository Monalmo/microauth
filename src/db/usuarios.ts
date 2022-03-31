import { ObjectId } from 'mongodb'
import DB from '../db'

const nombreDB = 'eperk'

// primero se debn crear las interfaces que se utilizaran en las solicitudes
export interface datosPersonales {
	nombre: string
	apellidos: string
	telefono: string
	email?: string
}

export interface datosOrg {
	nombre: string
	nombreCorto: string
	IDFiscal: string
	pais: string
}

export interface representanteLegal {
	nombre: string
	identificacion: string
	email: string
	telefono: string
}

export interface onboarding {
	pais: string
	email: string
	contrasena: string
	datosPersonales: boolean
	// hacer interfaces
	datosOrg: datosOrg
	ubicacionOrg: true
	representante: representanteLegal
}

export interface orgCreada {
	orgID?: ObjectId
	organizacion: datosOrg
	representanteLegal: representanteLegal
}

export interface perfilDeUsuarioModel {
	_id: ObjectId
	usuarioID: ObjectId
	creacion: Date
	createdBy: ObjectId
	datosPersonales?: datosPersonales
	onboarding?: onboarding
	creaciones?: orgCreada[]
}

// conexion a bbdd
async function getCollection(col: string | undefined) {
	if (col === 'login') {
		const db = await DB('ePerkLogin')

		return db.collection<perfilDeUsuarioModel>('userLogins')
	} else {
		const db = await DB(nombreDB)

		return db.collection<perfilDeUsuarioModel>('perfiles')
	}
}

const usuariosService = {
	async usuarioXusuarioID(usuarioID) {
		try {
			const db = await getCollection()
			const usuario = await db.findOne({ _id: usuarioID })

			return usuario
		} catch (error) {
			throw { error }
		}
	}
}

export default usuariosService
