import db from '../config/database'

function toColmeia(colmeiaDb: unknown): Colmeia | null {
	const colmeia = colmeiaDb as Colmeia
    
	if (!colmeia) { return null }
	else {
		return {
			id: colmeia.id,
			numero: colmeia.numero,
			apiarioId: colmeia.apiarioId,
			estadoCriaNova: colmeia.estadoCriaNova,
			estadoCriaMadura: colmeia.estadoCriaMadura,
			estadoMel: colmeia.estadoMel,
			estadoPolen: colmeia.estadoPolen,
			estadoRainha: colmeia.estadoRainha
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

	static async buscarColmeiasPorApiarioId(apiarioId: number): Promise<Colmeia[]> {
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
}