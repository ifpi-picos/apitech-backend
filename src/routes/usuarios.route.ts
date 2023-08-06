import { Router, Request, Response } from 'express'
import { UsuariosService } from '../services/usuarios.service'
import { UsuariosController } from '../controllers/usuarios.controller'
import logger from '../config/logger'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
	try {
		const usuarioValidado = await UsuariosService.validarNovoUsuario(req.body)

		if (usuarioValidado instanceof Array) {
			return res.status(400).send(usuarioValidado)
		}
		else {
			const usuario = await UsuariosController.cadastrarUsuario(usuarioValidado)

			return res.status(201).send({
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email
			})
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).send('Erro desconhecido ao cadastrar usuário')
	}
})

export default router