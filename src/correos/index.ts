import { customAlphabet } from 'nanoid/async'
import { OptionalId } from 'mongodb'
import moment from 'moment'
import DB from '@lib/db'

import { plantillas } from './plantillas/contrasenas'
import { objetoCorreoInterfaceDB, credencialesCorreo } from './types'
import { enviar } from './enviar'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const MiniID = customAlphabet(alphabet, 10)

const enFila = []
let enviandoCorreos

const credenciales: credencialesCorreo = {}
let correoIniciado: boolean | void
correoIniciado = undefined

async function init(): Promise<boolean> {
	console.log('iniciando correo')
	const db = await DB('correos-config')
	const obtenidas = await db.collection('credenciales').findOne({ _id: 'correo' })
	credenciales.smtpUsername = obtenidas.SMTPUsername
	credenciales.smtpPassword = obtenidas.SMTPPassword
	credenciales.dominio = obtenidas.dominio
	correoIniciado = true
	return true
}

async function enviarCorreos(nuevo) {
	enFila.push(nuevo)
	if (!correoIniciado) await init()
	// console.log("nuevo Correo", nuevo);
	if (enviandoCorreos) return
	enviandoCorreos = true
	do {
		const correo = enFila.shift()
		const smtpUsername = credenciales.smtpUsername
		const smtpPassword = credenciales.smtpPassword
		const enviado = await enviar(correo, smtpUsername, smtpPassword, credenciales.dominio)
		if (enviado && enviado.ok) {
			const db = await DB('eperk-correos')
			await db
				.collection<OptionalId<objetoCorreoInterfaceDB>>('Correos')
				.findOneAndUpdate(
					{ _id: correo._id },
					{ $set: { enviado: true, fechaEnvio: moment().format('DD-MM-YY HH:mm:ss') } },
					{ upsert: true, returnDocument: 'after' }
				)
			// console.log('correoXEnviar', correoXEnviar)
		}
	} while (enFila.length > 0)
	enviandoCorreos = false
}

export const correosService = {
	async enviarConfirmacionContrasena(email: string, nombre: string, codigo: string) {
		try {
			const fx = 'correosService.enviarConfirmacionContrasena'
			console.log(fx, { email, nombre, codigo })

			const codigoArray = codigo.split('')

			const body = plantillas.codigoRecuperacionContrasena(nombre, codigoArray)
			const correoID = await MiniID()

			const correoXEncolar = {
				_id: correoID,
				email,
				body,
				subject: 'Confirmación de contraseña',
				enviado: false,
				fechaSolicitud: moment().format('DD-MM-YY HH:mm:ss')
			}
			const db = await DB('correos')
			await db.collection<OptionalId<objetoCorreoInterfaceDB>>('correos').insertOne(correoXEncolar)

			await enviarCorreos(correoXEncolar)

			return 'correo enviado'
		} catch (error) {
			console.log('Error enviando correo de confirmacion de contraseña: ', error)
			throw error
		}
	}
}
