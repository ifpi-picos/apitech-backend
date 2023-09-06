import db from '../config/database'

export class ApiariosController {
	static async cadastrarApiario(apiario: ApiarioPreCadastro): Promise<Apiario> {
		return await db.apiarios.create({ data: apiario })
	}

	static async buscarApiarioPorId(id: number): Promise<Apiario | null> {
		return await db.apiarios.findUnique({ where: { id: id } })
	}

	static async buscarApiarioPorNomeEUsuarioId(nome: string, usuarioId: number): Promise<Apiario[]> {
		return await db.apiarios.findMany({ where: { nome: nome, usuarioId: usuarioId } })
	}

	static async buscarApiariosPorUsuarioId(usuarioId: number): Promise<Apiario[]> {
		return await db.apiarios.findMany({ where: { usuarioId: usuarioId } })
	}

	static async atualizarApiarioPorId(id: number, apiario: ApiarioPreModificacao): Promise<Apiario | null> {
		return await db.apiarios.update({ where: { id: id }, data: apiario })
	}

	static async apagarApiarioPorId(id: number): Promise<Apiario | null> {
		return await db.apiarios.delete({ where: { id: id } })
	}
}