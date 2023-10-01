import { Router, Request, Response } from 'express'
import { UsuariosController } from '../controllers/usuarios.controller'
import { UsuariosService } from '../services/usuarios.service'
import gerarCodigo from '../utils/codigosRecuperacao.util'
import { Email } from '../utils/emails.utils'
import logger from '../config/logger'
import { CodigosRecuperacaoController } from '../controllers/codigosRecuperacao.controller'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
	try {
		if (!req.body.email || !req.body.senha) {
			return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' })
		}

		const usuario = await UsuariosController.buscarUsuarioPorEmail(req.body.email)

		if (!usuario) {
			return res.status(404).json({ mensagem: 'Usuário não encontrado' })
		}
		else {
			const senhaCorreta = await UsuariosService.validarSenha(req.body.senha, usuario.senha)

			if (!senhaCorreta) {
				return res.status(401).json({ mensagem: 'Senha incorreta' })
			}
			else {
				const token = UsuariosService.gerarToken(usuario.id)

				return res.status(200).json({ token: token })
			}
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao autenticar usuário' })
	}
})

router.post('/token', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			const token = UsuariosService.gerarToken(req.usuario.id)
			res.status(200).json({ token: token })
		}
		else {
			res.status(401).json({ mensagem: 'Token inválido' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao validar token' })
	}
})

router.post('/redefinir-senha', async (req: Request, res: Response) => {
	try {
		if (req.body.email && !req.body.codigo && !req.body.senha) {
			const usuario = await UsuariosController.buscarUsuarioPorEmail(req.body.email)

			if (!usuario) {
				return res.status(404).json({ mensagem: 'Usuário não encontrado' })
			}
			else {
				const codigoRecuperacao = await gerarCodigo(usuario.id)

				const emailEnviado = await Email.enviarEmailRecuperacao(usuario, codigoRecuperacao)

				if (!emailEnviado) {
					return res.status(500).json({ mensagem: 'Erro ao enviar email de recuperação de senha' })
				}
				else {
					return res.status(200).json({ mensagem: 'Código de recuperação enviado para o email com sucesso' })
				}
			}
		}
		else if (req.body.email && req.body.codigo && req.body.senha) {
			const usuario = await UsuariosController.buscarUsuarioPorEmail(req.body.email)

			if (usuario) {
				const codigoRecuperacao = await gerarCodigo(usuario.id)

				if (codigoRecuperacao == req.body.codigo) {
					const infoCodigo = await CodigosRecuperacaoController.buscarCodigoRecuperacaoPorCodigo(codigoRecuperacao)

					if (infoCodigo && infoCodigo.usuarioId == usuario.id) {
						if (!usuario) {
							return res.status(404).json({ mensagem: 'Usuário não encontrado' })
						}
						else {
							if (req.body.senha.length < 8) {
								return res.status(400).json({ mensagem: 'Senha deve ter no mínimo 8 caracteres' })
							}
							else {
								const senhaHash = await UsuariosService.hashSenha(req.body.senha)

								await UsuariosController.atualizarSenhaPorId(usuario.id, senhaHash)
								await CodigosRecuperacaoController.apagarCodigoRecuperacaoPorCodigo(codigoRecuperacao)

								return res.status(200).json({ mensagem: 'Senha atualizada com sucesso' })
							}
						}
					}
					else {
						return res.status(400).json({ mensagem: 'Código de recuperação inválido' })
					}
				}
				else {
					return res.status(400).json({ mensagem: 'Código de recuperação inválido' })
				}
			}
			else {
				return res.status(404).json({ mensagem: 'Usuário não encontrado' })
			}
		}
		else {
			return res.status(400).json({ mensagem: 'Email ou código de recuperação e nova senha são obrigatórios' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao recuperar senha' })
	}
})

export default router