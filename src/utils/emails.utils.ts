import nodemailer from 'nodemailer'
import config from '../config/config'
import logger from '../config/logger'
import { readFileSync } from 'fs'
import path from 'path'

const transporter = nodemailer.createTransport({
	host: config.EMAIL_HOST,
	port: config.EMAIL_PORT,
	secure: config.EMAIL_PORT === 465,
	auth: {
		user: config.EMAIL_USER,
		pass: config.EMAIL_PASSWORD,
	}
})

export class Email {
	static async enviarEmailRecuperacao(usuario: Usuario, codigo: string): Promise<boolean> {
		let html = readFileSync(path.join(__dirname, '..', '..', 'src', 'utils', 'emails', 'redefinirSenha.html'), 'utf8')

		html = html.replace(/\$nome\$/g, usuario.nome.split(' ')[0])
		html = html.replace(/\$codigo\$/g, codigo)

		const nome = usuario.nome.split(' ')[0]

		if (config.NODE_ENV === 'test') { 
			return true
		}
		else {
			const res = await transporter.sendMail({
				from: 'Apitech <apitech.nao.responder@gmail.com>',
				to: usuario.email,
				subject: 'Recuperação de senha - Apitech',
				text: `Olá, ${nome}! Seu código de recuperação de senha é ${codigo}.`,
				html: html,
			})

			if (res.rejected.length > 0) {
				logger.registrarErro(`Erro ao enviar email de recuperação de senha para ${usuario.email}.`)
			}
			else {
				logger.atualizarArquivoLogs(`Email de recuperação de senha enviado para ${usuario.email}.`)
			}

			return res.rejected.length == 0
		}
	}
}