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
		res.status(500).json({ mensagem: 'Erro desconhecido ao cadastrar usuário' })
	}
})

router.get('/', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			res.status(200).json({
				id: req.usuario.id,
				nome: req.usuario.nome,
				email: req.usuario.email
			})
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao buscar usuário' })
	}
})

router.patch('/', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			const usuarioValidado = await UsuariosService.validarUsuarioModificado(req.body, req.usuario.id)

			if (usuarioValidado instanceof Array) {
				return res.status(400).send(usuarioValidado)
			}
			else {
				const usuario = await UsuariosController.atualizarUsuario(req.usuario.id, usuarioValidado)

				return res.status(200).json({
					id: usuario.id,
					nome: usuario.nome,
					email: usuario.email
				})
			}
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao atualizar usuário' })
	}
})

router.delete('/', async (req: Request, res: Response) => {
	try {
		if (req.usuario) {
			await UsuariosController.apagarUsuario(req.usuario.id)

			res.status(200).json({ mensagem: 'Usuário apagado com sucesso' })
		}
		else {
			res.status(401).json({ mensagem: 'Usuário não autenticado' })
		}
	}
	catch (erro) {
		logger.registrarErro(erro)
		res.status(500).json({ mensagem: 'Erro desconhecido ao apagar usuário' })
	}
})

export default router