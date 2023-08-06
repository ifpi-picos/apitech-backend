const request = require('supertest')
const { construirApp } = require('../../dist/app')

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
