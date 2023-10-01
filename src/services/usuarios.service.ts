import { UsuariosController } from '../controllers/usuarios.controller'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from '../config/config'

type ErrosDeValidacao = { campo: string, mensagem: string }[]

export class UsuariosService {
	static regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

	static async validarNovoUsuario(body: unknown): Promise<UsuarioPreCadastro | ErrosDeValidacao> {
		const errosDeValidacao: ErrosDeValidacao = []

		const usuarioBody = body as UsuarioPreCadastro

		const usuario: UsuarioPreCadastro = {
			nome: usuarioBody.nome,
			email: usuarioBody.email,
			senha: usuarioBody.senha
		}

		if (!usuario.nome) { errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome não informado' }) }
		if (!usuario.email) { errosDeValidacao.push({ campo: 'email', mensagem: 'Email não informado' }) }
		if (!usuario.senha) { errosDeValidacao.push({ campo: 'senha', mensagem: 'Senha não informada' }) }

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}

		usuario.nome.split(' ').forEach((nome: string) => {
			if (!nome.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/) || nome.length < 2) {
				errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome deve conter apenas letras' })
				return
			}
		})

		if (usuario.email && !this.regexEmail.test(usuario.email)) { errosDeValidacao.push({ campo: 'email', mensagem: 'Email inválido' }) }
		if (usuario.senha && usuario.senha.length < 8) { errosDeValidacao.push({ campo: 'senha', mensagem: 'Senha deve ter no mínimo 8 caracteres' }) }

		if (usuario.senha) { usuario.senha = await bcrypt.hash(usuario.senha, config.SALT_ROUNDS) }

		if (usuario.email) {
			const usuarioCadastrado = await UsuariosController.buscarUsuarioPorEmail(usuario.email)

			if (usuarioCadastrado) { errosDeValidacao.push({ campo: 'email', mensagem: 'Email já cadastrado' }) }
		}

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}
		else {
			usuario.nome = usuario.nome!.trim()
			usuario.email = usuario.email!.trim()

			return usuario
		}
	}

	static async validarSenha(senha: string, senhaHash: string): Promise<boolean> {
		return await bcrypt.compare(senha, senhaHash)
	}

	static async validarUsuarioModificado(body: unknown, usuarioId: number): Promise<UsuarioPreModificacao | ErrosDeValidacao> {
		const errosDeValidacao: ErrosDeValidacao = []

		const usuarioBody = body as UsuarioPreCadastro

		const usuario: UsuarioPreModificacao = {
			nome: usuarioBody.nome || undefined,
			email: usuarioBody.email || undefined,
			senha: usuarioBody.senha || undefined
		}

		if (!usuario.nome && !usuario.email && !usuario.senha) { errosDeValidacao.push({ campo: 'todos', mensagem: 'Nenhum campo a ser modificado informado' }) }

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}

		if (usuario.nome) {
			usuario.nome.split(' ').forEach((nome: string) => {
				if (!nome.match(/^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/) || nome.length < 2) {
					errosDeValidacao.push({ campo: 'nome', mensagem: 'Nome deve conter apenas letras' })
					return
				}
			})
		}

		if (usuario.email && !this.regexEmail.test(usuario.email)) { errosDeValidacao.push({ campo: 'email', mensagem: 'Email inválido' }) }
		if (usuario.senha && usuario.senha.length < 8) { errosDeValidacao.push({ campo: 'senha', mensagem: 'Senha deve ter no mínimo 8 caracteres' }) }
		else {
			if (usuario.senha) {
				usuario.senha = await bcrypt.hash(usuario.senha!, config.SALT_ROUNDS)
			}
		}

		if (usuario.email) {
			const usuarioCadastrado = await UsuariosController.buscarUsuarioPorEmail(usuario.email)

			if (usuarioCadastrado != null && usuarioCadastrado.id != usuarioId) { errosDeValidacao.push({ campo: 'email', mensagem: 'Email já cadastrado' }) }
		}

		if (errosDeValidacao.length > 0) {
			return errosDeValidacao
		}
		else {
			return {
				nome: usuario.nome ? usuario.nome.trim() : undefined,
				email: usuario.email ? usuario.email.trim() : undefined,
				senha: usuario.senha
			}
		}
	}

	static gerarToken(id: number): string {
		return jwt.sign({ id }, config.JWT_TOKEN, { expiresIn: '8d' })
	}

	static async hashSenha(senha: string): Promise<string> {
		return await bcrypt.hash(senha, config.SALT_ROUNDS)
	}
}