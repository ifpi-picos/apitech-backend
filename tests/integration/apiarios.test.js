const request = require('supertest')
const { construirApp } = require('../../dist/app')
const db = require('../../dist/config/database')

jest.setTimeout(30000)
describe('POST /apiarios', () => {
	let app
	let token

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({
			where: {
				OR: [
					{ nome: 'Teste' },
					{ nome: 'Teste Get Apiarios' },
					{ nome: 'Teste Patch Apiarios' },
					{ nome: 'Teste Delete Apiarios' },
					{ nome: 'Teste Patch Apiarios II' },
				]
			}
		})

		await request(app).post('/usuarios').send({
			nome: 'Teste Apiarios',
			email: 'teste_post_apiarios@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_post_apiarios@email.com',
			senha: '12345678'
		})

		token = res.body.token
	})

	it('201 - Cadastro de novo apiário', async () => {
		const res = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste',
		})

		expect(res.status).toBe(201)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('nome')
	})

	it('400 - Cadastro de novo apiário com nome já cadastrado', async () => {
		const res = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste',
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Cadastro de novo apiário sem nome', async () => {
		const res = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})
})

describe('GET /apiarios', () => {
	let app
	let token

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({
			where: {
				OR: [
					{ nome: 'Teste' },
					{ nome: 'Teste Get Apiarios' },
					{ nome: 'Teste Patch Apiarios' },
					{ nome: 'Teste Delete Apiarios' },
					{ nome: 'Teste Patch Apiarios II' },
				]
			}
		})

		await request(app).post('/usuarios').send({
			nome: 'Teste Apiarios',
			email: 'teste_get_apiarios@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_get_apiarios@email.com',
			senha: '12345678'
		})

		token = res.body.token
	})

	it('200 - Listagem de apiários', async () => {
		await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Get Apiarios',
		})

		const res2 = await request(app).get('/apiarios').set('Authorization', `Bearer ${token}`)

		expect(res2.status).toBe(200)
		expect(res2.body).toBeInstanceOf(Array)
		expect(res2.body.length).toBe(1)
	})

	it('404 - Listagem de apiários sem nenhum apiário', async () => {
		await db.default.apiarios.deleteMany({})

		const res = await request(app).get('/apiarios').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(404)
		expect(res.body.mensagem).toBe('Não há apiários cadastrados para este usuário')
	})
})

describe('PATCH /apiarios/:id', () => {
	let app
	let token
	let id

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({
			where: {
				OR: [
					{ nome: 'Teste' },
					{ nome: 'Teste Get Apiarios' },
					{ nome: 'Teste Patch Apiarios' },
					{ nome: 'Teste Delete Apiarios' },
					{ nome: 'Teste Patch Apiarios II' },
				]
			}
		})

		await request(app).post('/usuarios').send({
			nome: 'Teste Apiarios',
			email: 'teste_patch_apiarios@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_patch_apiarios@email.com',
			senha: '12345678'
		})

		token = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Patch Apiarios',
		})

		id = res2.body.id
	})

	it('200 - Atualização do nome de um apiário', async () => {
		const res = await request(app).patch(`/apiarios/${id}`).set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Patch Apiarios 2',
		})

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('nome')
		expect(res.body.nome).toBe('Teste Patch Apiarios 2')
	})

	it('400 - Atualização do nome de um apiário com nome já cadastrado', async () => {
		const res = await request(app).patch(`/apiarios/${id}`).set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Patch Apiarios 2',
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Atualização do nome de um apiário com um nome inválido', async () => {
		const res = await request(app).patch(`/apiarios/${id}`).set('Authorization', `Bearer ${token}`).send({
			nome: '',
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Atualização do nome de um apiário sem nome', async () => {
		const res = await request(app).patch(`/apiarios/${id}`).set('Authorization', `Bearer ${token}`).send({})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('403 - Atualização de um apiário de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Patch Apiarios II',
			email: 'teste_patch_apiarios_2@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_patch_apiarios_2@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Patch Apiarios II',
		})

		const id2 = res2.body.id

		const res3 = await request(app).patch(`/apiarios/${id2}`).set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Patch Apiarios 3',
		})

		expect(res3.status).toBe(403)
		expect(res3.body).toHaveProperty('mensagem')
	})

	it('404 - Atualização do nome de um apiário com id inválido', async () => {
		const res = await request(app).patch('/apiarios/0').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Patch Apiarios 3',
		})

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})

describe('DELETE /apiarios/:id', () => {
	let app
	let token
	let id

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({
			where: {
				OR: [
					{ nome: 'Teste' },
					{ nome: 'Teste Get Apiarios' },
					{ nome: 'Teste Patch Apiarios' },
					{ nome: 'Teste Delete Apiarios' },
					{ nome: 'Teste Patch Apiarios II' },
				]
			}
		})

		await request(app).post('/usuarios').send({
			nome: 'Teste Apiarios',
			email: 'teste_delete_apiarios@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_delete_apiarios@email.com',
			senha: '12345678'
		})

		token = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Delete Apiarios',
		})

		id = res2.body.id
	})

	it('200 - Exclusão de um apiário', async () => {
		const res = await request(app).delete(`/apiarios/${id}`).set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('403 - Exclusão de um apiário de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Delete Apiarios II',
			email: 'teste_delete_apiarios_2@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_delete_apiarios_2@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Delete Apiarios II',
		})

		const id2 = res2.body.id

		const res3 = await request(app).delete(`/apiarios/${id2}`).set('Authorization', `Bearer ${token}`)

		expect(res3.status).toBe(403)
		expect(res3.body).toHaveProperty('mensagem')
	})

	it('404 - Exclusão de um apiário com id inválido', async () => {
		const res = await request(app).delete('/apiarios/0').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})

})