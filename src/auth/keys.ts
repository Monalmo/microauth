import DB from '../db/index'
import crearKeys from './rsa'

async function guardarkeys() {
	const db = await DB('Apoderades-config')
	const llaves = crearKeys()
	console.log('llaves ', llaves)

	await db.collection<any>('config').insertOne({ _id: 'llaves', ...llaves })

	return llaves
}

export default guardarkeys
