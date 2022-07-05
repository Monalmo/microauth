import DB from '@lib/db'


export async function guardarCredencialesCorreo (SMTPUsername: string, SMTPPassword: string, dominio: string): Promise<string> {

	const credenciales = {
		dominio,
		SMTPUsername, 
		SMTPPassword
	}
	const db = await DB('correos-config')
	await db.collection('credenciales').findOneAndUpdate({ _id: 'correo' }, { $set: { ...credenciales } }, { upsert: true, returnDocument: 'after' })
	return 'credenciales guardadas'
}

