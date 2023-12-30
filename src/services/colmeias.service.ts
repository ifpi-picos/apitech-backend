import { ColmeiasController } from '../controllers/colmeias.controller'
import { CriaLocalizada, QuantidadeCria, EstadoCriaNova, EstadoCriaMadura, MelLocalizado, QuantidadeMel, EstadoMel, PolenLocalizado, QuantidadePolen, RainhaLocalizada, EstadoRainha, AspectoRainha } from '../types/enums'

type ErrosDeValidacao = { campo: string, mensagem: string }[]

export class ColmeiasService {
	static async validarNovaColmeia(body: unknown) {
		const colmeia = body as ColmeiaPreCadastro

		if (!colmeia.apiarioId) {
			return [{ campo: 'apiarioId', mensagem: 'O id do apiário é obrigatório' }]
		}

		const colmeias = await ColmeiasController.contarColmeiasPorApiarioId(colmeia.apiarioId)

		colmeia.numero = colmeias + 1

		return colmeia
	}

	static async validarAtualizacaoColmeia(body: unknown) {
		const colmeia = body as ColmeiaHistorico

		const errosDeValidacao: ErrosDeValidacao = []

		const colmeiaModificada: ColmeiaPreModificacao = {
			estadoCriaNova: {},
			estadoCriaMadura: {},
			estadoMel: {},
			estadoPolen: {},
			estadoRainha: {}
		}

		if (colmeia.estadoCriaNova) {
			if (colmeia.estadoCriaNova.localizada) {
				if (colmeia.estadoCriaNova.localizada in CriaLocalizada) {
					colmeiaModificada.estadoCriaNova = {
						...colmeiaModificada.estadoCriaNova,
						localizada: colmeia.estadoCriaNova.localizada
					}

					if (colmeia.estadoCriaNova.quantidade) {
						if (colmeia.estadoCriaNova.quantidade in QuantidadeCria) {
							colmeiaModificada.estadoCriaNova = {
								...colmeiaModificada.estadoCriaNova,
								quantidade: colmeia.estadoCriaNova.quantidade
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoCriaNova.quantidade', mensagem: 'Quantidade da cria nova inválida' })
						}
					}

					if (colmeia.estadoCriaNova.estado) {
						if (colmeia.estadoCriaNova.estado in EstadoCriaNova) {
							colmeiaModificada.estadoCriaNova = {
								...colmeiaModificada.estadoCriaNova,
								estado: colmeia.estadoCriaNova.estado
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoCriaNova.estado', mensagem: 'Estado da cria nova inválido' })
						}
					}
				}
			}
			else {
				errosDeValidacao.push({ campo: 'estadoCriaNova.localizada', mensagem: 'Estado da cria nova não informado' })
			}
		}

		if (colmeia.estadoCriaMadura) {
			if (colmeia.estadoCriaMadura.localizada) {
				if (colmeia.estadoCriaMadura.localizada in CriaLocalizada) {
					colmeiaModificada.estadoCriaMadura = {
						...colmeiaModificada.estadoCriaMadura,
						localizada: colmeia.estadoCriaMadura.localizada
					}

					if (colmeia.estadoCriaMadura.quantidade) {
						if (colmeia.estadoCriaMadura.quantidade in QuantidadeCria) {
							colmeiaModificada.estadoCriaMadura = {
								...colmeiaModificada.estadoCriaMadura,
								quantidade: colmeia.estadoCriaMadura.quantidade
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoCriaMadura.quantidade', mensagem: 'Quantidade da cria madura inválida' })
						}
					}

					if (colmeia.estadoCriaMadura.estado) {
						if (colmeia.estadoCriaMadura.estado in EstadoCriaMadura) {
							colmeiaModificada.estadoCriaMadura = {
								...colmeiaModificada.estadoCriaMadura,
								estado: colmeia.estadoCriaMadura.estado
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoCriaMadura.estado', mensagem: 'Estado da cria madura inválido' })
						}
					}
				}
			}
			else {
				errosDeValidacao.push({ campo: 'estadoCriaMadura.localizada', mensagem: 'Estado da cria madura não informado' })
			}
		}

		if (colmeia.estadoMel) {
			if (colmeia.estadoMel.localizada) {
				if (colmeia.estadoMel.localizada in MelLocalizado) {
					colmeiaModificada.estadoMel = {
						...colmeiaModificada.estadoMel,
						localizada: colmeia.estadoMel.localizada
					}

					if (colmeia.estadoMel.quantidade) {
						if (colmeia.estadoMel.quantidade in QuantidadeMel) {
							colmeiaModificada.estadoMel = {
								...colmeiaModificada.estadoMel,
								quantidade: colmeia.estadoMel.quantidade
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoMel.quantidade', mensagem: 'Quantidade de mel inválida' })
						}
					}

					if (colmeia.estadoMel.estado) {
						if (colmeia.estadoMel.estado in EstadoMel) {
							colmeiaModificada.estadoMel = {
								...colmeiaModificada.estadoMel,
								estado: colmeia.estadoMel.estado
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoMel.estado', mensagem: 'Estado do mel inválido' })
						}
					}
				}
			}
			else {
				errosDeValidacao.push({ campo: 'estadoMel.localizada', mensagem: 'Estado do mel não informado' })
			}
		}

		if (colmeia.estadoPolen) {
			if (colmeia.estadoPolen.localizada) {
				if (colmeia.estadoPolen.localizada in PolenLocalizado) {
					colmeiaModificada.estadoPolen = {
						...colmeiaModificada.estadoPolen,
						localizada: colmeia.estadoPolen.localizada
					}

					if (colmeia.estadoPolen.quantidade) {
						if (colmeia.estadoPolen.quantidade in QuantidadePolen) {
							colmeiaModificada.estadoPolen = {
								...colmeiaModificada.estadoPolen,
								quantidade: colmeia.estadoPolen.quantidade
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoPolen.quantidade', mensagem: 'Quantidade de pólen inválida' })
						}
					}
				}
			}
			else {
				errosDeValidacao.push({ campo: 'estadoPolen.localizada', mensagem: 'Estado do pólen não informado' })
			}
		}

		if (colmeia.estadoRainha) {
			if (colmeia.estadoRainha.localizada) {
				if (colmeia.estadoRainha.localizada in RainhaLocalizada) {
					colmeiaModificada.estadoRainha = {
						...colmeiaModificada.estadoRainha,
						localizada: colmeia.estadoRainha.localizada
					}

					if (colmeia.estadoRainha.estado) {
						if (colmeia.estadoRainha.estado in EstadoRainha) {
							colmeiaModificada.estadoRainha = {
								...colmeiaModificada.estadoRainha,
								estado: colmeia.estadoRainha.estado
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoRainha.estado', mensagem: 'Estado da rainha inválido' })
						}
					}

					if (colmeia.estadoRainha.aspecto) {
						if (colmeia.estadoRainha.aspecto in AspectoRainha) {
							colmeiaModificada.estadoRainha = {
								...colmeiaModificada.estadoRainha,
								aspecto: colmeia.estadoRainha.aspecto
							}
						}
						else {
							errosDeValidacao.push({ campo: 'estadoRainha.aspecto', mensagem: 'Aspecto da rainha inválido' })
						}
					}
				}
			}
			else {
				errosDeValidacao.push({ campo: 'estadoRainha.localizada', mensagem: 'Estado da rainha não informado' })
			}
		}

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}
		else {
			return colmeiaModificada
		}
	}
}