const request = require('supertest')
const { construirApp } = require('../../dist/app')
const db = require('../../dist/config/database')

jest.setTimeout(30000)
describe('POST /colmeias', () => {
	let app
	let token
	let apiarioId

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({})
		await db.default.colmeias.deleteMany({})

		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias',
			email: 'teste_colmeias@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_colmeias@email.com',
			senha: '12345678'
		})

		token = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Colmeias',
		})

		apiarioId = res2.body.id
	})

	it('201 - Criar colmeia', async () => {
		const res = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({
			apiarioId: apiarioId
		})

		expect(res.status).toBe(201)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('numero')
		expect(res.body).toHaveProperty('apiarioId')
	})

	it('400 - Criar colmeia com apiario inexistente', async () => {
		const res = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({
			nome: 'Colmeia Teste'
		})

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body[0]).toHaveProperty('mensagem')
	})

	it('403 - Criar colmeia em apiario de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias',
			email: 'teste_colmeias_2@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_colmeias_2@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Colmeias 2',
		})

		const apiarioId2 = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({
			apiarioId: apiarioId2
		})

		expect(res3.status).toBe(403)
		expect(res3.body).toHaveProperty('mensagem')
	})

	it('404 - Criar colmeia com apiario inválido', async () => {
		const res = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({
			nome: 'Colmeia Teste',
			apiarioId: -1
		})

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})

