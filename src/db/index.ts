import chalk from 'chalk'
import { MongoClient } from 'mongodb'

let cliente: MongoClient

const DB = async function (nombreDB: string) {
	try {
		if (cliente) return cliente.db(`${nombreDB}-test`)
		cliente = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017')
		await cliente.connect()
		console.log('🗃  ✅', chalk.green('Conexión a la base de datos establecida'))

		return cliente.db(`${nombreDB}-test`)
	} catch (e) {
		console.error('🗃 💥', chalk.red('No se pudo conectar con la base de datos'))
		console.log(e)
		throw 'No se pudo conectar con la base de datos'
	}
}

export default DB
