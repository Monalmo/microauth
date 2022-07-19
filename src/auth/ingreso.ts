import DB from '@lib/db'
import Llavero, { ParDeLlavesExportadas } from '@lib/llavero'
import { JWTPayload } from 'jose'


type llaveroDB = {
	_id: string
	firma: ParDeLlavesExportadas
	encriptacion: ParDeLlavesExportadas
}

export interface bodyTokenIngreso extends JWTPayload {
	email?: string
}

const LLaveroServerID = 'principal'

let llaveroServer: Llavero

export const ingresoService = {
	async tokenLogin(email: string) {
		const fx = 'tokenLogin'
		console.log(fx, email)
		// eslint-disable-next-line no-useless-catch
		try {
			if (!llaveroServer) {
				console.log('Sin llavero', llaveroServer)
				await this.obtenerLlavero()
			}
			const token = await llaveroServer.firmarToken({ email })
			console.log({ token })

			return token
		} catch (error) {
			throw error
		}
	},
	
	async obtenerLlavero(): Promise<Llavero> {
		if (llaveroServer) return llaveroServer

		const db = await DB('config')
		const llaveroDB = await db.collection<llaveroDB>('llaveros').findOne({ _id: LLaveroServerID })

		if (llaveroDB) {
			console.log('Con llaveroDB')
			const llaveroReinstanciado = new Llavero(LLaveroServerID)
			await llaveroReinstanciado.importar(llaveroDB)
			llaveroServer = llaveroReinstanciado
			return llaveroServer
		}

		console.log('Creando LLavero')

		llaveroServer = new Llavero(LLaveroServerID)
		await llaveroServer.init(true)
		const llaveroAlmacenable = await llaveroServer.exportar()
		console.log('llavero Almacenable', llaveroAlmacenable)

		const llaveroGuardado = await db
			.collection<llaveroDB>('llaveros')
			.insertOne({ _id: LLaveroServerID, ...llaveroAlmacenable })
		console.log('llaveroGuardado', llaveroGuardado)

		return llaveroServer
	}
}

export async function verificarToken(tokenAuth: string): Promise<bodyTokenIngreso> {
	try {
		const tokenarray = tokenAuth.split(' ')
		console.log('token de la verificacion', tokenarray)
		// valida si el token comienza con Bearer
		if (tokenarray[0] !== 'Bearer') throw new Error('token no es valido')
		// constante con token
		const token = tokenarray[1]
		const llavero = await ingresoService.obtenerLlavero()
		const jwtBody = await llavero.verificarFirmaToken(token)
		console.log('jwtBody', jwtBody)

		return jwtBody
	} catch (error) {
		throw new Error('token no es valido')
	}
}