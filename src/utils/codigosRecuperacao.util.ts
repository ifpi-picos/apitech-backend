import { CodigosRecuperacaoController } from '../controllers/codigosRecuperacao.controller'
import { kami_cache as Cache } from '@alanfilho184/kami-lru-cache'
import { DateTime } from 'luxon'

const cacheCodigos = new Cache({
	maxAge: 1000 * 60 * 10,
	rateOfVerifyAgedKeys: 1000 * 15,
	updateAgeOnGet: false,
})

let geradorPronto = false
CodigosRecuperacaoController.apagarCodigosRecuperacaoExpirados()
	.then(() => {
		CodigosRecuperacaoController.buscarTodosCodigosRecuperacao()
			.then(codigos => {
				codigos.forEach(codigo => {
					cacheCodigos.set(codigo.codigo, codigo, DateTime.fromJSDate(codigo.expiraEm).diffNow('milliseconds').milliseconds)
				})
			})

		const apagarCodigoDb = async (key: string) => {
			try {
				await CodigosRecuperacaoController.apagarCodigoRecuperacaoPorCodigo(key)
			}
			catch (erro) {
				//ignore
			}
		}

		cacheCodigos.events.on('keyAutoDelete', apagarCodigoDb)
		cacheCodigos.events.on('keyDelete', apagarCodigoDb)

		geradorPronto = true
	})

async function gerarCodigo(usuarioId: number): Promise<string> {
	while (!geradorPronto) {
		await new Promise(resolve => setTimeout(resolve, 500))
	}

	if (!usuarioId) throw new Error('O id do usuário não foi informado.')

	let codigo = '0'

	cacheCodigos.map.forEach((infoCodigoJson: string) => {
		const infoCodigo = JSON.parse(infoCodigoJson)

		if (infoCodigo.content.usuarioId == usuarioId) {
			codigo = infoCodigo.key
			return codigo
		}
	})

	if (codigo == '0') {
		do {
			codigo = Math.floor(Math.random() * 999999).toString()

			while (codigo.length < 6) {
				codigo = '0' + codigo
			}

		} while (cacheCodigos.has(codigo))

		const infoCodigo = {
			codigo: codigo,
			usuarioId: usuarioId,
			expiraEm: DateTime.now().setZone('America/Fortaleza').plus({ minutes: 10 }).toJSDate(),
		}

		cacheCodigos.set(codigo, infoCodigo)

		await CodigosRecuperacaoController.cadastrarCodigoRecuperacao(infoCodigo)
	}

	return codigo
}

export default gerarCodigo

export { cacheCodigos }