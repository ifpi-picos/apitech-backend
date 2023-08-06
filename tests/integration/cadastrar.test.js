const request = require('supertest')
const { construirApp } = require('../../dist/app')
const db = require('../../dist/config/database')

describe('POST /usuario', () => {
	let app

	beforeAll(async () => {
		app = await construirApp

		await db.default.usuarios.deleteMany({})
	})

	it('201 - Cadastro de novo usuário', async () => {
		const res = await request(app).post('/usuarios').send({
			nome: 'Teste',
			email: 'teste_cadastro@email.com',
			senha: '12345678'
		})

		expect(res.status).toBe(201)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('nome')
		expect(res.body).toHaveProperty('email')
	})

	it('400 - Cadastro de novo usuário com email já cadastrado', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste',
			email: 'teste_cadastro@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/usuarios').send({
			nome: 'Teste',
			email: 'teste_cadastro@email.com',
			senha: '12345678'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Cadastro de novo usuário com email inválido', async () => {
		const res = await request(app).post('/usuarios').send({
			nome: 'Teste',
			email: 'teste_cadastro',
			senha: '12345678'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Cadastro de novo usuário com senha inválida', async () => {
		const res = await request(app).post('/usuarios').send({
			nome: 'Teste',
			email: 'teste_cadastro2@email.com',
			senha: '123'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Cadastro de novo usuário com nome inválido', async () => {
		const res = await request(app).post('/usuarios').send({
			nome: 'T',
			email: 'teste_cadastro3@email.com',
			senha: '12345678'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Cadastro de novo usuário com dados faltando', async () => {
		const res = await request(app).post('/usuarios').send({})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(3)
	})
})
