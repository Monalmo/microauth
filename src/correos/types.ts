export type credencialesCorreo = {
	smtpUsername?: string
	smtpPassword?: string
}

interface attachments {
	filename: string
	content: string
	encoding: string
}
export interface objetoCorreoInterface {
	_id?: string
	email: string
	body: string
	subject: string
	attachments?: attachments
	enviado?: boolean
	fechaSolicitud?: string
	nombre?: string
}

export interface objetoCorreoInterfaceDB {
	_id: string
	email: string
	body: string
	subject: string
	attachments?: attachments[]
	enviado?: boolean
	fechaSolicitud?: string
	nombre?: string
}
