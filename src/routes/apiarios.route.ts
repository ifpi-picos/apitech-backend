import { Router, Request, Response } from 'express'
import { ApiariosService } from '../services/apiarios.service'
import { ApiariosController } from '../controllers/apiarios.controller'
import logger from '../config/logger'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			req.body.usuarioId = req.usuario.id

			const apiarioValidado = await ApiariosService.validarNovoApiario(req.body)

			if (apiarioValidado instanceof Array) {
				return res.status(400).send(apiarioValidado)
			}
			else {
				const apiario = await ApiariosController.cadastrarApiario(apiarioValidado)

				return res.status(201).send({
					id: apiario.id,
					nome: apiario.nome,
					usuarioId: apiario.usuarioId
				})
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
			const apiarios = await ApiariosController.buscarApiariosPorUsuarioId(req.usuario.id)

			if (apiarios.length > 0) {
				return res.status(200).send(apiarios)
			}
			else {
				return res.status(404).json({ mensagem: 'Não há apiários cadastrados para este usuário' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao listar apiários' })
	}
})

router.patch('/:id', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			const apiario = await ApiariosController.buscarApiarioPorId(Number(req.params.id))

			if (apiario) {
				if (apiario.usuarioId === req.usuario.id) {
					const apiarioValidado = await ApiariosService.validarModificacaoApiario(req.body, req.usuario.id)

					if (apiarioValidado instanceof Array) {
						return res.status(400).send(apiarioValidado)
					}
					else {
						const apiarioAtualizado = await ApiariosController.atualizarApiarioPorId(Number(req.params.id), apiarioValidado)

						if (apiarioAtualizado) {
							return res.status(200).send({
								id: apiarioAtualizado.id,
								nome: apiarioAtualizado.nome,
								usuarioId: apiarioAtualizado.usuarioId
							})
						}
						else {
							logger.registrarErro({ mensagem: 'Erro desconhecido ao modificar apiário', resposta: apiarioAtualizado })
							return res.status(500).json({ mensagem: 'Erro desconhecido ao modificar apiário' })
						}
					}
				}
				else {
					return res.status(403).json({ mensagem: 'Usuário não autorizado a modificar este apiário' })
				}
			}
			else {
				return res.status(404).json({ mensagem: 'Apiário não encontrado' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao modificar apiário' })
	}
})

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			const apiario = await ApiariosController.buscarApiarioPorId(Number(req.params.id))

			if (apiario) {
				if (apiario.usuarioId === req.usuario.id) {
					await ApiariosController.apagarApiarioPorId(Number(req.params.id))

					res.status(200).send({ mensagem: 'Apiário apagado com sucesso' })
				}
				else {
					return res.status(403).json({ mensagem: 'Usuário não autorizado a apagar este apiário' })
				}
			}
			else {
				return res.status(404).json({ mensagem: 'Apiário não encontrado' })
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao apagar apiário' })
	}
})

export default router