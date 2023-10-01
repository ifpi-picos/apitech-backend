import db from '../config/database'
import { DateTime } from 'luxon'

export class CodigosRecuperacaoController {
	static async cadastrarCodigoRecuperacao(codigoRecuperacao: CodigoRecuperacaoPreCadastro): Promise<CodigoRecuperacao> {
		return await db.codigosRecuperacao.create({ data: codigoRecuperacao })
	}

	static async buscarCodigoRecuperacaoPorCodigo(codigo: string): Promise<CodigoRecuperacao | null> {
		return await db.codigosRecuperacao.findUnique({ where: { codigo: codigo } })
	}

	static async buscarCodigoRecuperacaoPorUsuarioId(usuarioId: number): Promise<CodigoRecuperacao | null> {
		return await db.codigosRecuperacao.findUnique({ where: { usuarioId: usuarioId } })
	}

	static async buscarTodosCodigosRecuperacao(): Promise<CodigoRecuperacao[]> {
		return await db.codigosRecuperacao.findMany()
	}

	static async apagarCodigoRecuperacaoPorCodigo(codigo: string): Promise<CodigoRecuperacao | null> {
		return await db.codigosRecuperacao.delete({ where: { codigo: codigo } })
	}

	static async apagarCodigosRecuperacaoExpirados(): Promise<void> {
		const tempoAtual = DateTime.now().setZone('America/Fortaleza')
		const ids: number[] = []

		const codigos = await this.buscarTodosCodigosRecuperacao()

		codigos.forEach(codigo => {
			const expiraEm = DateTime.fromJSDate(codigo.expiraEm).setZone('America/Fortaleza')

			if (expiraEm <= tempoAtual) {
				ids.push(codigo.id)
			}
		})

		await db.codigosRecuperacao.deleteMany({ where: { id: { in: ids } } })

		return
	}
}