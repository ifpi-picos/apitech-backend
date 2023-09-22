const request = require('supertest')
const { construirApp } = require('../../dist/app')

describe('Exemplo de série testes', () => {
	let app

	beforeAll(async () => {
		app = await construirApp
	})

	it('Exemplo de teste', async () => {
		const res = await request(app).get('/exemplo')

		expect(res.status).toBe(401)
	})
})
