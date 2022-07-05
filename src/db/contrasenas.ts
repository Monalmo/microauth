import DB from '@lib/db'
import { ObjectID } from 'bson'
import bcrypt from 'bcrypt'
import { usuarioLogin } from './usuarios'
import { cambioContrasena } from './usuarios'
import { correosService } from '@/correos'
import { customAlphabet } from 'nanoid/async'

const MiniID = customAlphabet('0123456789', 4)

export const contrasenaService = {
	// Guarda hash de contraseña y envía codigo de confirmación por email
	async crear(pass: string, usuario: ObjectID) {
		try {
			// crea un hash del pass enviado por el cliente
			const saltos = 16
			const passHash = await bcrypt.hash(pass, saltos)

			// crea el codigo de confirmacion
			const codigo = await MiniID()

			const cambioContrasena: cambioContrasena = {
				contrasenaSolicitada: passHash,
				codigoConfirmacion: codigo
			}

			// guarda el hash y el codigo de confirmacion en la base de datos
			const db = await DB('login')
			const contrasenaGuardada = await db
				.collection<usuarioLogin>('usuarios')
				.findOneAndUpdate({ _id: usuario }, { $set: { cambioContrasena } }, { returnDocument: 'after' })
			if (!contrasenaGuardada) throw 'Error al guardar contraseña'

			return await correosService.enviarConfirmacionContrasena(
				contrasenaGuardada.value.email,
				contrasenaGuardada.value.nombre,
				codigo
			)
		} catch (error) {
			console.log('Error guardando contraseña: ', error)
			throw error
		}
	}
}
