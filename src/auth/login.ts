import DB from '../db/index'
import guardarkeys from './keys'
import crearToken from './jwt'
import bcrypt from 'bcrypt'

async function login(user, pass) {
	const db = await DB('eperk')

	const usuario = await db.collection('userlogins').findOne({ email: user })

	if (!usuario) {
		return { error: true, mensaje: 'Las credenciales no son correctas' }
	}
	console.log(usuario)

	const validaPassword = await bcrypt.compare(pass, usuario.password)

	if (!validaPassword) {
		return { error: true, mensaje: 'Las credenciales no son correctas' }
	}

	// busca llaves
	const dbc = await DB('config')
	const llaves = await dbc.collection<any>('config').findOne({ _id: 'llaves' })
	console.log('buscando llaves', llaves)

	// crea llaves si no existen
	if (!llaves) await guardarkeys()
	const privateKey = llaves.privateKey

	// crea token
	const token = await crearToken(usuario, privateKey)

	if (!token) return { error: true, mensaje: 'token invalido' }
	console.log('token creado en login', token)

	return { ok: 1, token, usuario }
}

export default login
