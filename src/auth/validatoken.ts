import jwt from 'jsonwebtoken'
import DB from '../db/index'
import { ReqWithToken } from './types'

async function verificaToken(req: ReqWithToken) {
	const tokenAuth = req.headers.authorization
	console.log('Validaciones Verificacion token')
	let publicKey
	console.log('publicKey verificacion token', publicKey)
	const db = await DB('config')

	// si no tenemos publickey la buscamos
	if (!publicKey) {
		const llaves = await db.collection('config').findOne({})
		publicKey = llaves.publicKey
	}
	console.log('publicKey validacion', publicKey)

	console.log('heaaders blablabla', tokenAuth)
	// constante con la autorizacion del header
	// array separando bearer del token
	const tokenarray = tokenAuth.split(' ')
	console.log('token de la verificacion', tokenarray)

	// valida si el token comienza con Bearer
	if (tokenarray[0] !== 'Bearer') return { error: 'token no es valido' }
	// constante con token
	const token = tokenarray[1]

	if (token) console.log('token', token)

	if (!token) return { error: 'token no es valido' }

	// crear promesa con la verificacion del token
	const decoded = jwt.decode(token)
	console.log('decoded payload', decoded)

	req.token = decoded

	console.log('try del verificando')

	return new Promise(function (resolve, reject) {
		jwt.verify(token, publicKey, function (err, decoded) {
			if (err === null) {
				resolve(decoded)
			} else {
				reject(err)
			}
		})
	})
	// const verificado = jwt.verify(token, publicKey)
	// console.log('token Vrify', verificado)
	// if (verificado === true) { req.user = verificado } else console.error('no se ha verificado el token')
}

export default verificaToken
