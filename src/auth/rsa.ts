import NodeRSA from 'node-rsa'

function crearKeys() {
	const key = new NodeRSA({ b: 1024 })
	const publicKey = key.exportKey('public')
	const privateKey = key.exportKey('private')

	return { publicKey, privateKey }
}

export default crearKeys
