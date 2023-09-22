import db from '../config/database'

export class ColmeiasController {
    static async cadastrarColmeia(colmeia: ColmeiaPreCadastro): Promise<Colmeia> {
        return await db.colmeias.create({ data: colmeia })
    }

    static async buscarColmeiaPorId(id: number): Promise<Colmeia | null> {
        return await db.colmeias.findUnique({ where: { id: id } })
    }

    static async buscarColmeiaPorNomeEApiarioId(nome: string, apiarioId: number): Promise<Colmeia[]> {
        return await db.colmeias.findMany({ where: { nome: nome, apiarioId: apiarioId } })
    }

    static async buscarColmeiasPorApiarioId(apiarioId: number): Promise<Colmeia[]> {
        return await db.colmeias.findMany({ where: { apiarioId: apiarioId } })
    }

    static async atualizarColmeiaPorId(id: number, colmeia: ColmeiaPreModificacao): Promise<Colmeia | null> {
        return await db.colmeias.update({ where: { id: id }, data: colmeia })
    }

    static async apagarColmeiaPorId(id: number): Promise<Colmeia | null> {
        return await db.colmeias.delete({ where: { id: id } })
    }
}