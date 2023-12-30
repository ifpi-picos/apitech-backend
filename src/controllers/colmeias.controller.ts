import db from '../config/database'

function toColmeia(colmeiaDb: unknown): Colmeia | null {
	const colmeia = colmeiaDb as Colmeia

	if (!colmeia) { return null }
	else {
		return {
			id: colmeia.id,
			numero: colmeia.numero,
			apiarioId: colmeia.apiarioId,
		}
	}
}

function toColmeiaHistorico(ColmeiaHistoricoDb: unknown): ColmeiaHistorico | null {
	const colmeiaHistorico = ColmeiaHistoricoDb as ColmeiaHistorico

	if (!colmeiaHistorico) { return null }
	else {
		return {
			id: colmeiaHistorico.id,
			colmeiaId: colmeiaHistorico.colmeiaId,
			data: colmeiaHistorico.data,
			estadoCriaNova: colmeiaHistorico.estadoCriaNova,
			estadoCriaMadura: colmeiaHistorico.estadoCriaMadura,
			estadoMel: colmeiaHistorico.estadoMel,
			estadoPolen: colmeiaHistorico.estadoPolen,
			estadoRainha: colmeiaHistorico.estadoRainha,
		}
	}
}

export class ColmeiasController {
	static async cadastrarColmeia(colmeia: ColmeiaPreCadastro): Promise<Colmeia> {
		return toColmeia(await db.colmeias.create({ data: colmeia }))!
	}

	static async buscarColmeiaPorId(id: number): Promise<Colmeia | null> {
		return toColmeia(await db.colmeias.findUnique({ where: { id: id } }))
	}

	static async buscarColmeiaComHistoricoPorId(id: number): Promise<ColmeiaHistorico | null> {
		return toColmeiaHistorico(await db.colmeiasHistorico.findFirst({
			where: { colmeiaId: id },
			orderBy: { data: 'desc' }
		}))
	}

	static async buscarColmeiasPorApiarioId(apiarioId: number): Promise<Colmeia[]> {
		const colmeias = await db.colmeias.findMany({ where: { apiarioId: apiarioId } })
		if (colmeias.length > 0) {
			return colmeias.map(colmeia => toColmeia(colmeia)!)
		}
		else {
			return []
		}
	}

	static async buscarHistoricoPorColmeiaId(colmeiaId: number): Promise<ColmeiaHistorico[]> {
		const colmeiasHistorico = await db.colmeiasHistorico.findMany({
			where: { colmeiaId: colmeiaId },
			orderBy: { data: 'desc' }
		})

		if (colmeiasHistorico.length > 0) {
			return colmeiasHistorico.map(colmeiaHistorico => toColmeiaHistorico(colmeiaHistorico)!)
		}
		else {
			return []
		}
	}

	static async listarColmeiasPorApiarioId(apiarioId: number): Promise<Colmeia[]> {
		const colmeias = await db.colmeias.findMany({ where: { apiarioId: apiarioId } })
		if (colmeias.length > 0) {
			return colmeias.map(colmeia => toColmeia(colmeia)!)
		}
		else {
			return []
		}
	}

	static async contarColmeiasPorApiarioId(apiarioId: number): Promise<number> {
		return await db.colmeias.count({ where: { apiarioId: apiarioId } })
	}

	static async cadastrarAtualizacaoPorColmeiaId(colmeiaId: number, colmeia: Colmeia & ColmeiaPreModificacao): Promise<ColmeiaHistorico | null> {
		return await db.$transaction(async (db) => {
			const colmeiaHistorico = toColmeiaHistorico(await db.colmeiasHistorico.create({
				data: {
					colmeiaId: colmeiaId,
					data: new Date(),
					estadoCriaNova: JSON.stringify(colmeia.estadoCriaNova ? colmeia.estadoCriaNova : {}),
					estadoCriaMadura: JSON.stringify(colmeia.estadoCriaMadura ? colmeia.estadoCriaMadura : {}),
					estadoMel: JSON.stringify(colmeia.estadoMel ? colmeia.estadoMel : {}),
					estadoPolen: JSON.stringify(colmeia.estadoPolen ? colmeia.estadoPolen : {}),
					estadoRainha: JSON.stringify(colmeia.estadoRainha ? colmeia.estadoRainha : {}),
				}
			}))

			const entradasColmeiaHistorico = await db.colmeiasHistorico.count({ where: { colmeiaId: colmeiaId } })

			if (entradasColmeiaHistorico > 50) {
				const colmeiaHistoricoMaisAntigo = await db.colmeiasHistorico.findFirst({
					where: { colmeiaId: colmeiaId },
					orderBy: { data: 'asc' }
				})

				if (colmeiaHistoricoMaisAntigo) {
					await db.colmeiasHistorico.delete({ where: { id: colmeiaHistoricoMaisAntigo.id } })
				}
			}

			return colmeiaHistorico
		})
	}

	static async removerColmeiaPorId(id: number): Promise<Colmeia | null> {
		return toColmeia(await db.colmeias.delete({ where: { id: id } }))
	}
}