/* eslint-disable no-useless-catch */
import { ObjectId } from 'mongodb'
import DB from '@/lib/db'
import { projection } from './dbTypes'
import bcrypt from 'bcrypt'
import { customAlphabet } from 'nanoid/async'
import { correosService } from '@/correos'

const MiniID = customAlphabet('0123456789', 4)
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
	async crear(nombre: string, email: string, pass: string): Promise<usuarioLogin> {
		// crea un hash del pass enviado por el cliente
		const saltos = 16
		const passHash = await bcrypt.hash(pass, saltos)

		// crea el codigo de confirmacion
		const codigo = await MiniID()

		const cambioContrasena: cambioContrasena = {
			contrasenaSolicitada: passHash,
			codigoConfirmacion: codigo
		}

		const usuario: usuarioLogin = {
			nombre,
			email,
			cambioContrasena,
			creacion: new Date()
		}
		const db = await DB('login')
		const { insertedId } = await db.collection<usuarioLogin>('usuarios').insertOne(usuario)
		if (!insertedId) throw 'Error al crear usuario'

		await correosService.enviarConfirmacionContrasena(usuario.email, usuario.nombre, codigo)
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
