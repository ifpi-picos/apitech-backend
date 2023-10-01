const request = require('supertest')
const { construirApp } = require('../../dist/app')
const db = require('../../dist/config/database')

describe('POST /usuarios', () => {
	let app

	beforeAll(async () => {
		app = await construirApp

		await db.default.usuarios.deleteMany({
			where: {
				OR: [
					{ email: 'teste_cadastro' },
					{ email: 'teste_cadastro2' },
					{ email: 'teste_cadastro3' }
				]
			}
		})
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

describe('GET /usuarios', () => {
	let app
	let token

	beforeAll(async () => {
		app = await construirApp

		await request(app).post('/usuarios').send({
			nome: 'Teste Get Usuario',
			email: 'teste_get_usuario@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_get_usuario@email.com',
			senha: '12345678'
		})

		token = res.body.token
	})

	it('200 - Pegar informações do próprio usuário', async () => {
		const res = await request(app).get('/usuarios').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('nome')
		expect(res.body).toHaveProperty('email')
	})

	it('401 - Pegar informações do próprio usuário sem token', async () => {
		const res = await request(app).get('/usuarios')

		expect(res.status).toBe(401)
	})

	it('401 - Pegar informações do próprio usuário com token inválido', async () => {
		const res = await request(app).get('/usuarios').set('Authorization', 'Bearer tokeninvalido')

		expect(res.status).toBe(401)
	})
})

describe('PATCH /usuarios', () => {
	let app
	let token

	beforeAll(async () => {
		app = await construirApp

		await request(app).post('/usuarios').send({
			nome: 'Teste Patch Usuario',
			email: 'teste_patch_usuario@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_patch_usuario@email.com',
			senha: '12345678'
		})

		token = res.body.token
	})

	it('200 - Atualizar tudo do próprio usuário', async () => {
		const res = await request(app).patch('/usuarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Modificar Usuário',
			email: 'teste_patch_usuario_2@email.com',
			senha: '87654321'
		})

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('nome')
		expect(res.body).toHaveProperty('email')
		expect(res.body.nome).toBe('Teste Modificar Usuário')
		expect(res.body.email).toBe('teste_patch_usuario_2@email.com')

		const res2 = await request(app).post('/login').send({
			email: res.body.email,
			senha: '12345678'
		})

		expect(res2.status).toBe(401)

		const res3 = await request(app).post('/login').send({
			email: res.body.email,
			senha: '87654321'
		})

		expect(res3.status).toBe(200)
		expect(res3.body).toHaveProperty('token')
		token = res3.body.token
	})

	it('400 - Atualizar tudo do próprio usuário com informações inválidas', async () => {
		const res = await request(app).patch('/usuarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'T',
			email: 'teste_patch_usuario_2',
			senha: '123'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(3)
	})

	it('400 - Atualizar email com um email já cadastrado', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Patch Usuario',
			email: 'teste_patch_usuario_3@email.com',
			senha: '12345678'
		})

		const res = await request(app).patch('/usuarios').set('Authorization', `Bearer ${token}`).send({
			email: 'teste_patch_usuario_3@email.com'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Atualizar usuário com dados faltando', async () => {
		const res = await request(app).patch('/usuarios').set('Authorization', `Bearer ${token}`).send({})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})
})

describe('DELETE /usuarios', () => {
	let app
	let token

	beforeAll(async () => {
		app = await construirApp

		await request(app).post('/usuarios').send({
			nome: 'Teste Delete Usuario',
			email: 'teste_delete_usuario@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_delete_usuario@email.com',
			senha: '12345678'
		})

		token = res.body.token
	})

	it('200 - Deletar o próprio usuário', async () => {
		const res = await request(app).delete('/usuarios').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
	})

	it('401 - Deletar o próprio usuário sem token', async () => {
		const res = await request(app).delete('/usuarios')

		expect(res.status).toBe(401)
	})
})