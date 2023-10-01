import { Request, Response, NextFunction } from 'express'
import { UsuariosController } from '../controllers/usuarios.controller'
import jwt from 'jsonwebtoken'
import config from '../config/config'

const rotasIgnoradas: string[] = ['POST|/login', 'POST|/usuarios', 'POST|/redefinir-senha']

export async function verificarToken(req: Request, res: Response, next: NextFunction) {
	req.startTime = performance.now()
	try {
		if (!rotasIgnoradas.includes(`${req.method}|${req.path.endsWith('/') ? req.path.substring(0, req.path.length - 1) : req.path}`)) {
			if (!req.headers.authorization) {
				return res.status(401).json({ mensagem: 'Token não informado' })
			}
			else {
				if (req.headers.authorization.split(' ')[0] === 'Bearer') {
					const token = req.headers.authorization.split(' ')[1]

					let verificacaoToken: jwt.JwtPayload | string | null = null
					try {
						verificacaoToken = await jwt.verify(token, config.JWT_TOKEN)
					}
					catch (error) {
						return res.status(401).json({ mensagem: 'Token inválido' })
					}

					if (verificacaoToken instanceof Object) {
						const usuario = await UsuariosController.buscarUsuarioPorId(verificacaoToken.id)
						if (usuario === null) {
							return res.status(404).json({ mensagem: 'Usuário não encontrado' })
						}
						else {
							req.usuario = {
								id: usuario.id,
								nome: usuario.nome,
								email: usuario.email
							}

							next()
						}
					}
					else {
						return res.status(401).json({ mensagem: 'Token inválido' })
					}
				}
				else {
					return res.status(400).json({ mensagem: 'Tipo de token inválido' })
				}
			}
		}
		else {
			next()
		}
	}
	catch (error) {
		res.status(500).json({ mensagem: 'Erro desconhecido ao verificar token' })
	}
}