const { DateTime } = require('luxon')
const Logger = require('../../dist/logs/index.js')
const fs = require('fs')
const path = require('path')

describe('Classe Logger', () => {
	let logger

	beforeAll(() => {
		logger = new Logger.default()
	})

	it('Criar ou ler um arquivo de log', () => {
		const day = DateTime.now().setZone('America/Fortaleza').toFormat('dd-LL-yyyy')
        
		expect(logger.arquivoLogs).toEqual(path.join(__dirname, '../', '../', 'dist', 'logs', `log-${day}.log`))
	})

	it('Atualizar o arquivo de log', () => {
		logger.atualizarArquivoLogs('teste\n')

		const conteudo = fs.readFileSync(logger.arquivoLogs, 'utf-8')
		expect(conteudo.endsWith('teste\n')).toBeTruthy()
	})

	it('Registrar um Erro', () => {
		logger.registrarErro({ mensagem: 'teste' })
		const conteudo = fs.readFileSync(logger.arquivoLogs, 'utf-8')

		const linhasConteudo = conteudo.split('\n')

		expect(linhasConteudo[linhasConteudo.length - 4].endsWith('[ Error 500 ]')).toBeTruthy()
		expect(linhasConteudo[linhasConteudo.length - 3]).toEqual('{ mensagem: \'teste\' }')
		expect(linhasConteudo[linhasConteudo.length - 2]).toEqual('---------------------------')

	})

	it('Procurar o arquivo de log atual', () => {
		const arquivoLog = logger.procurarArquivoLogs(DateTime.now())

		expect(arquivoLog).toBeInstanceOf(Buffer)
	})

	it('Procurar um arquivo de log inexistente', () => {
		const arquivoLog = logger.procurarArquivoLogs(DateTime.fromISO('2020-01-01'))

		expect(arquivoLog).toBe(false)
	})

	it('Rotacionar os arquivos de log', () => {
        
		let arquivosAntigos = fs.readdirSync(path.join(__dirname, '../', '../', 'dist', 'logs'))
		arquivosAntigos = arquivosAntigos.filter(file => file.startsWith('log-'))

		let arquivoMaisAntigo
		arquivosAntigos.forEach(arquivo => {
			if (!arquivoMaisAntigo) {
				arquivoMaisAntigo = arquivo
			} else {
				const dataArquivo = DateTime.fromFormat(arquivo.replace('log-', '').replace('.log', ''), 'dd-LL-yyyy')
				const dataArquivoMaisAntigo = DateTime.fromFormat(arquivoMaisAntigo.replace('log-', '').replace('.log', ''), 'dd-LL-yyyy')

				if (dataArquivo < dataArquivoMaisAntigo) {
					arquivoMaisAntigo = arquivo
				}
			}
		})

		const dataArquivoMaisAntigo = DateTime.fromFormat(arquivoMaisAntigo.replace('log-', '').replace('.log', ''), 'dd-LL-yyyy')

		for (let i = 0; i < 40 - arquivosAntigos.length; i++) {
			const dataArquivoNovo = dataArquivoMaisAntigo.minus({ days: i + 1 })
			const nomeArquivoNovo = `log-${dataArquivoNovo.toFormat('dd-LL-yyyy')}.log`
            
			fs.writeFileSync(path.join(__dirname, '../', '../', 'dist', 'logs', nomeArquivoNovo), 'Este é um Log criado por uma rotina de teste')
		}

		new Logger.default()

		let arquivos = fs.readdirSync(path.join(__dirname, '../', '../', 'dist', 'logs'))

		arquivos = arquivos.filter(file => file.startsWith('log-'))

		expect(arquivos.length).toEqual(30)
	})
})

