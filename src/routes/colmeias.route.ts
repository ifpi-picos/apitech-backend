import { Router, Request, Response } from 'express'
import { ColmeiasService } from '../services/colmeias.service'
import { ColmeiasController } from '../controllers/colmeias.controller'
import { ApiariosController } from '../controllers/apiarios.controller'
import logger from '../config/logger'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			if (req.body.apiarioId) {
				if (Number.isInteger(Number(req.body.apiarioId))) {
					const apiario = await ApiariosController.buscarApiarioPorId(Number(req.body.apiarioId))

					if (apiario) {
						if (apiario.usuarioId === req.usuario.id) {
							const colmeiaValidada = await ColmeiasService.validarNovaColmeia(req.body)

							if (colmeiaValidada instanceof Array) {
								return res.status(400).send(colmeiaValidada)
							}
							else {
								const colmeia = await ColmeiasController.cadastrarColmeia(colmeiaValidada)

								return res.status(201).send({
									id: colmeia.id,
									numero: colmeia.numero,
									apiarioId: colmeia.apiarioId
								})
							}
						}
						else {
							return res.status(403).json({ mensagem: 'Usuário não autorizado a cadastrar colmeia neste apiário' })
						}
					}
					else {
						return res.status(404).json({ mensagem: 'Apiário não encontrado' })
					}
				}
				else {
					res.status(400).json([{ campo: 'apiarioId', mensagem: 'Apiário deve ser um número inteiro' }])
				}
			}
			else {
				res.status(400).json([{ campo: 'apiarioId', mensagem: 'Apiário não informado' }])
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao cadastrar apiário' })
	}
})

router.get('/', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			if (req.query.apiarioId) {
				if (Number.isInteger(Number(req.query.apiarioId))) {
					const apiario = await ApiariosController.buscarApiarioPorId(Number(req.query.apiarioId))

					if (apiario) {
						if (apiario.usuarioId === req.usuario.id) {
							const colmeias = await ColmeiasController.listarColmeiasPorApiarioId(Number(req.query.apiarioId))

							return res.status(200).send(colmeias)
						}
						else {
							return res.status(403).json({ mensagem: 'Usuário não autorizado a visualizar colmeias deste apiário' })
						}
					}
					else {
						return res.status(404).json({ mensagem: 'Apiário não encontrado' })
					}
				}
				else {
					res.status(400).json({ mensagem: 'Id do apiário deve ser um número inteiro' })
				}
			}
			else {
				res.status(400).json({ mensagem: 'Id do apiário não informado' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao buscar colmeias' })
	}
})

router.get('/:id', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			if (Number.isInteger(Number(req.params.id))) {
				const colmeia = await ColmeiasController.buscarColmeiaPorId(Number(req.params.id))

				if (colmeia) {
					const apiario = await ApiariosController.buscarApiarioPorId(colmeia.apiarioId)

					if (apiario) {
						if (apiario.usuarioId === req.usuario.id) {
							const colmeiaHistorico = await ColmeiasController.buscarColmeiaComHistoricoPorId(Number(req.params.id))

							const colmeiaCompleta = Object.assign({}, { estadoCriaNova: {}, estadoCriaMadura: {}, estadoMel: {}, estadoPolen: {}, estadoRainha: {} }, colmeia, colmeiaHistorico)

							return res.status(200).send(colmeiaCompleta)
						}
						else {
							return res.status(403).json({ mensagem: 'Usuário não autorizado a visualizar esta colmeia' })
						}
					}
					else {
						return res.status(404).json({ mensagem: 'Apiário não encontrado' })
					}
				}
				else {
					return res.status(404).json({ mensagem: 'Colmeia não encontrada' })
				}
			}
			else {
				res.status(400).json({ mensagem: 'Id da colmeia deve ser um número inteiro' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao buscar colmeia' })
	}
})

router.get('/:id/historico', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			if (Number.isInteger(Number(req.params.id))) {
				const colmeia = await ColmeiasController.buscarColmeiaPorId(Number(req.params.id))

				if (colmeia) {
					const apiario = await ApiariosController.buscarApiarioPorId(colmeia.apiarioId)

					if (apiario) {
						if (apiario.usuarioId === req.usuario.id) {
							const historico = await ColmeiasController.buscarHistoricoPorColmeiaId(Number(req.params.id))

							for (let i = 0; i < historico.length; i++) {
								historico[i] = Object.assign({}, historico[i], colmeia)
							}

							return res.status(200).send(historico)
						}
						else {
							return res.status(403).json({ mensagem: 'Usuário não autorizado a visualizar o histórico desta colmeia' })
						}
					}
					else {
						return res.status(404).json({ mensagem: 'Apiário não encontrado' })
					}
				}
				else {
					return res.status(404).json({ mensagem: 'Colmeia não encontrada' })
				}
			}
			else {
				res.status(400).json({ mensagem: 'Id da colmeia deve ser um número inteiro' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao buscar histórico da colmeia' })
	}
})

router.patch('/:id', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			if (Number.isInteger(Number(req.params.id))) {
				const colmeia = await ColmeiasController.buscarColmeiaPorId(Number(req.params.id))

				if (colmeia) {
					const apiario = await ApiariosController.buscarApiarioPorId(colmeia.apiarioId)

					if (apiario) {
						if (apiario.usuarioId === req.usuario.id) {
							const colmeiaValidada = await ColmeiasService.validarAtualizacaoColmeia(req.body)

							if (colmeiaValidada instanceof Array) {
								return res.status(400).send(colmeiaValidada)
							}
							else {
								const colmeiaAtualizada = Object.assign(colmeia, colmeiaValidada)

								await ColmeiasController.cadastrarAtualizacaoPorColmeiaId(Number(req.params.id), colmeiaAtualizada)

								return res.status(200).send({ mensagem: 'Colmeia atualizada com sucesso' })
							}
						}
						else {
							return res.status(403).json({ mensagem: 'Usuário não autorizado a atualizar esta colmeia' })
						}
					}
					else {
						return res.status(404).json({ mensagem: 'Apiário não encontrado' })
					}
				}
				else {
					return res.status(404).json({ mensagem: 'Colmeia não encontrada' })
				}
			}
			else {
				res.status(400).json({ mensagem: 'Id da colmeia deve ser um número inteiro' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao atualizar colmeia' })
	}
})

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			if (Number.isInteger(Number(req.params.id))) {
				const colmeia = await ColmeiasController.buscarColmeiaPorId(Number(req.params.id))

				if (colmeia) {
					const apiario = await ApiariosController.buscarApiarioPorId(colmeia.apiarioId)

					if (apiario) {
						if (apiario.usuarioId === req.usuario.id) {
							await ColmeiasController.removerColmeiaPorId(Number(req.params.id))

							return res.status(200).send({ mensagem: 'Colmeia deletada com sucesso' })
						}
						else {
							return res.status(403).json({ mensagem: 'Usuário não autorizado a deletar esta colmeia' })
						}
					}
					else {
						return res.status(404).json({ mensagem: 'Apiário não encontrado' })
					}
				}
				else {
					return res.status(404).json({ mensagem: 'Colmeia não encontrada' })
				}
			}
			else {
				res.status(400).json({ mensagem: 'Id da colmeia deve ser um número inteiro' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao deletar colmeia' })
	}
})

export default router