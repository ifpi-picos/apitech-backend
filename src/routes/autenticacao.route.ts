import { Router, Request, Response } from 'express'
import { UsuariosController } from '../controllers/usuarios.controller'
import { UsuariosService } from '../services/usuarios.service'
import logger from '../config/logger'

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

export default router