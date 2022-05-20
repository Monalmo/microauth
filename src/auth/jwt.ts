import jwt from 'jsonwebtoken'

// funcion que crea token en base a una promesa
function crearToken(usuario, privateKey) {
	return new Promise(function (resolve, reject) {
		jwt.sign(
			{
				id: usuario._id,
				llavePublica: 'shaveee',
				exp: Date.now() / 1000 + 50000 // expira en 5 min
			},
			privateKey,
			{ algorithm: 'RS256' },
			function (err, token) {
				console.log('creartoken funcion', token)

				if (err === null) {
					resolve(token)
				} else {
					reject(err)
				}
			}
		)
	})
}

export default crearToken
