/* eslint-disable no-useless-catch */
import { ObjectId } from 'mongodb'
import DB from '@/lib/db'
import { projection } from './dbTypes'

export interface cambioContrasena {
	contrasenaSolicitada: string
	intentosFallidos?: number
	codigoConfirmacion: string
}

export type usuarioLogin = {
	_id?: ObjectId
	contrasena?: string
	cambioContrasena?: cambioContrasena
	nombre: string
	email: string
	creacion: Date
}
const usuariosService = {
	async crear(nombre: string, email: string): Promise<usuarioLogin> {
		const usuario: usuarioLogin = {
			nombre,
			email,
			creacion: new Date()
		}
		const db = await DB('login')
		const { insertedId } = await db.collection<usuarioLogin>('usuarios').insertOne(usuario)
		if (!insertedId) throw 'Error al crear usuario'
		return {
			_id: insertedId,
			...usuario
		}
	},

	async obtenerXEmail(email: string, projection?: projection) {
		const db = await DB('login')
		const usuario = await db.collection<usuarioLogin>('usuarios').findOne({ email }, { projection })
		return usuario
	}
}

export default usuariosService
