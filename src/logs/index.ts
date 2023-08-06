import { DateTime } from 'luxon'
import * as fs from 'fs'
import path from 'path'
import { inspect } from 'util'
import color from 'colors'
import config from '../config/config'

export default class Logger {
	arquivoLogs: string
	constructor() {
		const day = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy')

		try {
			fs.readFileSync(path.join(__dirname, `log-${day}.log`))
		} catch (err) {
			fs.writeFileSync(path.join(__dirname, `log-${day}.log`), '')
		}

		this.arquivoLogs = path.join(__dirname, `log-${day}.log`)

		this.rotacionarLogs()
	}

	public atualizarArquivoLogs(log: string): void {
		const day = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy')

		if (path.join(__dirname, `log-${day}.log`) == this.arquivoLogs) {
			fs.appendFileSync(this.arquivoLogs, log)
		} else {
			fs.writeFileSync(path.join(__dirname, `log-${day}.log`), '')
			this.arquivoLogs = path.join(__dirname, `log-${day}.log`)
			fs.appendFileSync(this.arquivoLogs, log)
		}
	}

	private async rotacionarLogs(): Promise<void> {
		let logs = fs.readdirSync(path.join(__dirname))

		logs = logs.filter(fileName => {
			return fileName.match(/\.log$/g) != null
		})

		for (let _i = 0; _i < logs.length; _i++) {
			if (logs.length > 30) {
				let older = DateTime.now().setZone('America/Fortaleza')
				logs.forEach((log: string) => {
					const logTime = DateTime.fromFormat(log.replace('log-', '').replace('.log', ''), 'dd-LL-yyyy').setZone('America/Fortaleza')

					if (logTime.toMillis() < older.toMillis()) {
						older = logTime
					}
				})

				fs.rmSync(path.join(__dirname, `log-${older.toFormat('dd-LL-yyyy')}.log`))
				logs = logs.filter(fileName => {
					const logTime = DateTime.fromFormat(fileName.replace('log-', '').replace('.log', ''), 'dd-LL-yyyy').setZone('America/Fortaleza')

					if (logTime.toMillis() == older.toMillis()) {
						return false
					} else {
						return true
					}
				})
			} else {
				break
			}
		}
	}

	public registrarErro(err: unknown): void {
		const errorString = inspect(err, false, 99)

		const time = DateTime.now().setZone('America/Fortaleza').toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)

		if (config.NODE_ENV != 'test') {
			console.log(`[ ${color.green(time)} ] - [ ${color.red('Error 500')} ]\n${errorString}\n---------------------------\n`)
		}

		this.atualizarArquivoLogs(`[ ${time} ] - [ Error 500 ]\n`)
		this.atualizarArquivoLogs(errorString)
		this.atualizarArquivoLogs('\n---------------------------\n')
	}

	public procurarArquivoLogs(date: DateTime): Buffer | false {
		const day: string = date.toFormat('dd-LL-yyyy')

		try {
			return fs.readFileSync(path.join(__dirname, `log-${day}.log`))
		} catch (err) {
			return false
		}
	}
}