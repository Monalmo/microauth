/* eslint-disable no-useless-catch */
import { ObjectId } from 'mongodb'
import DB from '@/lib/db'
import { elSet, projection } from './dbTypes'
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
		const codigoHash = await bcrypt.hash(codigo, saltos)
		const cambioContrasena: cambioContrasena = {
			contrasenaSolicitada: passHash,
			codigoConfirmacion: codigoHash
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
	},

	async validarCodigoConfirmacion (email: string, codigo: string): Promise<'validado' | { intentosFallidos: number }> {
		const projection = {
			_id: 1,
			cambioContrasena: 1,
			email: 1
		}
		const db = await DB('login')
		const usuario = await db.collection<usuarioLogin>('usuarios').findOne({ email }, { projection })
		if (!usuario) throw 'Usuario no encontrado'
		const intentosFallidos = usuario.cambioContrasena?.intentosFallidos

		const contrasenaGuardada = usuario.cambioContrasena?.contrasenaSolicitada
		const codigoEnviado = usuario.cambioContrasena?.codigoConfirmacion
		const codigoValidado = await bcrypt.compare(codigo, codigoEnviado)

		if (!codigoValidado && (intentosFallidos === 2)) {
			await db.collection<usuarioLogin>('usuarios').findOneAndUpdate({ email }, { $set: { cambioContrasena: null } })
			throw 'Se ha equivocado 3 veces, se eliminó la contraseña'
		}

		if (!codigoValidado) {
			await db.collection<usuarioLogin>('usuarios').findOneAndUpdate({ _id: usuario._id }, { $inc: { 'cambioContrasena.intentosFallidos': 1 } })
			return {
				intentosFallidos: intentosFallidos + 1
			}
		}

		const elSet: elSet = {}
		elSet.pass = contrasenaGuardada
		elSet.cambioContrasena = null

		await db.collection<usuarioLogin>('usuarios').findOneAndUpdate({ _id: usuario._id }, { $set: elSet })
		return 'validado'

	}
	
}

export default usuariosService
