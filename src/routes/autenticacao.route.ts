import { Router, Request, Response } from 'express'
import { UsuariosController } from '../controllers/usuarios.controller'
import { UsuariosService } from '../services/usuarios.service'
import logger from '../config/logger'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
	try {
		if (!req.body.email || !req.body.senha) {
			return res.status(400).send({ mensagem: 'Email e senha são obrigatórios' })
		}

		const usuario = await UsuariosController.buscarUsuarioPorEmail(req.body.email)

		if (!usuario) {
			return res.status(404).send({ mensagem: 'Usuário não encontrado' })
		}
		else {
			const senhaCorreta = await UsuariosService.validarSenha(req.body.senha, usuario.senha)

			if (!senhaCorreta) {
				return res.status(401).send({ mensagem: 'Senha incorreta' })
			}
			else {
				const token = UsuariosService.gerarToken(usuario.id)

				return res.status(200).send({ token: token })
			}
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).send('Erro desconhecido ao autenticar usuário')
	}
})

export default router