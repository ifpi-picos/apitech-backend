import db from '../config/database'

export class UsuariosController {
	static async cadastrarUsuario(usuario: UsuarioPreCadastro): Promise<Usuario> {
		return await db.usuarios.create({ data: usuario })
	}

	static async buscarUsuarioPorId(id: number): Promise<Usuario | null> {
		return await db.usuarios.findUnique({ where: { id } })
	}

	static async buscarUsuarioPorEmail(email: string): Promise<Usuario | null> {
		return await db.usuarios.findUnique({ where: { email } })
	}

	static async atualizarUsuarioPorId(id: number, usuario: UsuarioPreModificacao): Promise<Usuario> {
		return await db.usuarios.update({ where: { id }, data: usuario })
	}

	static async atualizarSenhaPorId(id: number, senha: string): Promise<Usuario> {
		return await db.usuarios.update({ where: { id: id }, data: { senha: senha } })
	}

	static async apagarUsuarioPorId(id: number): Promise<Usuario> {
		return await db.usuarios.delete({ where: { id } })
	}
}