import { ColmeiasController } from '../controllers/colmeias.controller'

export class ColmeiasService {
	static async validarNovaColmeia(body: unknown){
		const colmeia = body as ColmeiaPreCadastro

		if(!colmeia.apiarioId){
			return [{ campo: 'apiarioId', mensagem: 'O id do apiário é obrigatório' }]
		}

		const colmeias = await ColmeiasController.contarColmeiasPorApiarioId(colmeia.apiarioId)

		colmeia.numero = colmeias + 1

		return colmeia
	}
}