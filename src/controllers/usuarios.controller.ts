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

	static async atualizarUsuario(id: number, usuario: UsuarioPreModificacao): Promise<Usuario> {
		return await db.usuarios.update({ where: { id }, data: usuario })
	}

	static async apagarUsuario(id: number): Promise<Usuario> {
		return await db.usuarios.delete({ where: { id } })
	}
}