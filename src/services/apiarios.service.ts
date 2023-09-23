import { ApiariosController } from '../controllers/apiarios.controller'

type ErrosDeValidacao = { campo: string, mensagem: string }[]

export class ApiariosService {
	static async validarNovoApiario(body: unknown): Promise<ApiarioPreCadastro | ErrosDeValidacao> {
		const errosDeValidacao: ErrosDeValidacao = []

		const apiarioBody = body as ApiarioPreCadastro

		const apiario: ApiarioPreCadastro = {
			nome: apiarioBody.nome,
			usuarioId: apiarioBody.usuarioId
		}

		if (!apiario.nome) { errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome não informado' }) }
		if (!apiario.usuarioId) { errosDeValidacao.push({ campo: 'usuarioId', mensagem: 'Usuário não informado' }) }

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}
		else {
			if (apiario.nome.length > 2) {
				apiario.nome.split(' ').forEach((nome: string) => {
					if (!nome.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_]+$/)) {
						errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome inválido' })
						return
					}
				})
			}

			if (errosDeValidacao.length > 0) {
				return errosDeValidacao
			}
			else {
				apiario.nome = apiario.nome.trim()

				const apiarioCadastrado = await ApiariosController.buscarApiarioPorNomeEUsuarioId(apiario.nome, apiario.usuarioId)

				if (apiarioCadastrado.length > 0) { errosDeValidacao.push({ campo: 'nome', mensagem: 'Apiário já cadastrado' }) }

				if (errosDeValidacao.length > 0) {
					return errosDeValidacao
				}
				else {
					return apiario
				}
			}
		}
	}

	static async validarModificacaoApiario(body: unknown, usuarioId: number): Promise<ApiarioPreModificacao | ErrosDeValidacao> {
		const errosDeValidacao: ErrosDeValidacao = []

		const apiarioBody = body as ApiarioPreModificacao

		const apiario: ApiarioPreModificacao = {
			nome: apiarioBody.nome,
			usuarioId: usuarioId
		}

		if (apiario.nome != undefined && apiario.nome != null) {
			if (apiario.nome.length > 2) {
				apiario.nome.split(' ').forEach((nome: string) => {
					if (!nome.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ0-9\-_]+$/)) {
						errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome inválido' })
						return
					}
				})
			}
			else {
				errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome inválido' })
			}
		}

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}
		else {
			const apiarioCadastrado = await ApiariosController.buscarApiarioPorNomeEUsuarioId(apiario.nome!, apiario.usuarioId)

			if (apiarioCadastrado.length > 0) {
				errosDeValidacao.push({ campo: 'nome', mensagem: 'Apiário já cadastrado' })

				return errosDeValidacao
			}
			else {
				apiario.nome = apiario.nome!.trim()

				return apiario
			}
		}
	}
}