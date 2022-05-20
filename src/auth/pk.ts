import DB from '../db/index'

// no usado aun funcion para guardad clave publica

async function obtenerPK() {
	console.log('obteniendo llave publica')
	const db = await DB('config')
	const publicKey = await db.collection('config').findOne({})

	global.pkglobal = publicKey
}

export default obtenerPK
