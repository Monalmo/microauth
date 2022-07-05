// 'use strict'
import nodemailer from 'nodemailer'
import { objetoCorreoInterface } from './types'

const smtpEndpoint = 'smtp.mailgun.org'
const port = 587

// const dev = process.env.MODO === 'dev'
// const cris = process.env.MODO === 'cris'
// const test = process.env.MODO === 'test'
const senderAddress = 'Dudi microauth service <noresponder@dudi.cl>'

export async function enviar(
	objetoCorreo: objetoCorreoInterface,
	smtpUsername: string,
	smtpPassword: string,
	preSender?: string
) {
	console.log('enviar', { smtpUsername, smtpPassword, preSender })
	if (!preSender) preSender = ''

	// console.log('objetoCorreo', objetoCorreo)
	const { email, body, subject, attachments } = objetoCorreo
	try {
		const transporter = nodemailer.createTransport({
			host: smtpEndpoint,
			port: port,
			secure: false,
			auth: {
				user: smtpUsername,
				pass: smtpPassword
			}
		})
		const mailOptions = {
			from: `${preSender}-${senderAddress}`,
			to: email,
			subject: subject,
			html: body,
			attachments
		}
		console.log('mailOptions', mailOptions)
		const info = await transporter.sendMail(mailOptions)
		console.log('Mensaje Enviado! Mensaje ID: ', info.messageId)
		return `Mensaje Enviado! Mensaje ID: ', ${info.messageId}`
	} catch (e) {
		console.error('Error enviando mail', e)
		return e
	}
}
