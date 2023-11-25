const request = require('supertest')
const { construirApp } = require('../../dist/app')
const db = require('../../dist/config/database')

jest.setTimeout(30000)
describe('POST /login', () => {
	let app

	beforeAll(async () => {
		app = await construirApp

		await request(app).post('/usuarios').send({
			nome: 'Teste Autenticacao',
			email: 'teste_autenticacao@email.com',
			senha: '12345678'
		})
	})

	it('200 - Login no sistema', async () => {
		const res = await request(app).post('/login').send({
			email: 'teste_autenticacao@email.com',
			senha: '12345678'
		})

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('token')
	})

	it('400 - Login no sistema com email inexistente', async () => {
		const res = await request(app).post('/login').send({
			email: 'teste_autenticacao',
			senha: '12345678'
		})

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Login no sistema com senha incorreta', async () => {
		const res = await request(app).post('/login').send({
			email: 'teste_autenticacao@email.com',
			senha: 'incorreta'
		})

		expect(res.status).toBe(401)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Login no sistema sem nenhuma credencial', async () => {
		const res = await request(app).post('/login').send({})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})
})

describe('POST /token', () => {
	let app
	let token

	beforeAll(async () => {
		app = await construirApp

		await request(app).post('/usuarios').send({
			nome: 'Teste Atualizar Token',
			email: 'teste_atualizar_token@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_atualizar_token@email.com',
			senha: '12345678'
		})

		token = res.body.token
	})

	it('200 - Atualizar um token válido', async () => {
		const res = await request(app).post('/token').set('Authorization', `Bearer ${token}`).send()

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('token')
	})

	it('401 - Atualizar um token inválido', async () => {
		const res = await request(app).post('/token').set('Authorization', `Bearer ${token}1`).send()

		expect(res.status).toBe(401)
		expect(res.body).toHaveProperty('mensagem')
		expect(res.body.mensagem).toBe('Token inválido')
	})
})

jest.setTimeout(30000)
describe('POST /redefinir-senha', () => {
	let app
	let usuarioId
	let usuarioId2
	let codigo2

	beforeAll(async () => {
		app = await construirApp

		await db.default.usuarios.deleteMany({
			where: {
				OR: [
					{ email: 'teste_redefinir_senha' },
					{ email: 'teste_redefinir_senha_2' },
					{ email: 'teste_redefinir_senha_3' }
				]
			}
		})

		const res = await request(app).post('/usuarios').send({
			nome: 'Teste Redefinir Senha',
			email: 'teste_redefinir_senha@email.com',
			senha: '12345678'
		})

		usuarioId = res.body.id

		const res2 = await request(app).post('/usuarios').send({
			nome: 'Teste Redefinir Senha',
			email: 'teste_redefinir_senha_3@email.com',
			senha: '12345678'
		})

		usuarioId2 = res2.body.id

		await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha_3@email.com',
		})

		codigo2 = await db.default.codigosRecuperacao.findUnique({ where: { usuarioId: usuarioId2 } })
	})

	it('200 - Redefinir senha', async () => {
		const res = await request(app).post('/login').send({
			email: 'teste_redefinir_senha@email.com',
			senha: '12345678'
		})

		expect(res.status).toBe(200)

		const res2 = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha@email.com',
		})

		expect(res2.status).toBe(200)
		expect(res2.body).toHaveProperty('mensagem')

		const codigo = await db.default.codigosRecuperacao.findUnique({ where: { usuarioId: usuarioId } })

		expect(codigo).toBeTruthy()

		const res3 = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha@email.com',
			codigo: codigo.codigo,
			senha: 'nova_senha'
		})

		expect(res3.status).toBe(200)
		expect(res3.body).toHaveProperty('mensagem')

		const res4 = await request(app).post('/login').send({
			email: 'teste_redefinir_senha@email.com',
			senha: 'nova_senha'
		})

		expect(res4.status).toBe(200)
		expect(res4.body).toHaveProperty('token')

		const codigo2 = await db.default.codigosRecuperacao.findUnique({ where: { usuarioId: usuarioId } })

		expect(codigo2).toBeFalsy()

		const res5 = await request(app).post('/login').send({
			email: 'teste_redefinir_senha@email.com',
			senha: '12345678'
		})

		expect(res5.status).toBe(401)
		expect(res5.body).toHaveProperty('mensagem')
	})

	it('400 - Redefinir senha sem email', async () => {
		const res = await request(app).post('/redefinir-senha').send({})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('404 - Redefinir senha com email inválido', async () => {
		const res = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha'
		})

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Redefinir senha com email inexistente', async () => {
		const res = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha_inexistente@email.com'
		})

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Redefinir senha sem código', async () => {
		const res = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha_3@email.com',
			senha: 'nova_senha'
		})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Redefinir senha com código inválido', async () => {
		const res = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha_3@email.com',
			codigo: '12345',
			senha: 'nova_senha'
		})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Redefinir senha com senha inválida', async () => {
		const res = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha_3@email.com',
			codigo: codigo2,
			senha: '123'
		})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Redefinir senha com código de outro usuário', async () => {
		const res = await request(app).post('/redefinir-senha').send({
			email: 'teste_redefinir_senha@email.com',
			codigo: codigo2,
			senha: 'nova_senha'
		})

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})
})