import { Request, Response, NextFunction } from 'express'
import { DateTime } from 'luxon'
import color from 'colors'
import LogHandler from '../logs'
import config from '../config/config'

const logHandler = new LogHandler()

export function logger(req: Request, res: Response, next: NextFunction) {
	let respostaEnviada: unknown
	const jsonAntigo = res.json
	res.json = json => {
		respostaEnviada = json
		res.json = jsonAntigo
		return res.json(json)
	}

	const tempo = DateTime.now().setZone('America/Fortaleza').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
	const recurso = `${req.method} ${req.url}`

	res.on('finish', () => {
		let info
		if (req.usuario && Object.keys(req.body)[0]) {
			const data = req.body

			if (data.senha) {
				data.senha = '*'
			}

			info = `Usuário: [ID: ${req.usuario.id} Nome: ${req.usuario.nome}}] | Body Request: [${JSON.stringify(data)}]`
		} else if (req.usuario && !Object.keys(req.body)[0]) {
			info = `Usuário: [ID: ${req.usuario.id} Name: ${req.usuario.nome}}]`
		} else if (Object.keys(req.body)[0]) {
			const data = req.body

			if (data.senha) {
				data.senha = '*'
			}

			info = `Body Request: [${JSON.stringify(data)}]`
		} else {
			info = 'Não autenticado | Sem body'
		}

		if(respostaEnviada) {
			info += ` | Body Response: [${JSON.stringify(respostaEnviada)}]`
		}

		let status: string = res.statusCode.toString()
		const statusNoColor = status

		if (parseInt(status) >= 200 && parseInt(status) < 300) {
			status = color.green(status)
		} else if (parseInt(status) >= 300 && parseInt(status) < 400) {
			status = color.cyan(status)
		} else if (parseInt(status) >= 400 && parseInt(status) < 500) {
			status = color.yellow(status)
		} else {
			status = color.red(status)
		}

		const execTime = (performance.now() - req.startTime).toFixed(0).toString() + 'ms'

		if (config.NODE_ENV != 'test') {
			console.log(
				`[ ${color.green(tempo)} ] - [ ${color.green(recurso)} ] - [ ${color.cyan(info)} ] - [ ${status} ${color.underline(execTime)} ]\n`,
			)
		}
		logHandler.atualizarArquivoLogs(`[ ${tempo} ] - [ ${recurso} ] - [ ${info} ] - [ ${statusNoColor} ${execTime} ]\n`)
	})

	next()
}