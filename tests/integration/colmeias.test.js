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

	it('400 - Criar colmeia com apiario inválido', async () => {
		const res = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({
			nome: 'Colmeia Teste',
			apiarioId: 'a'
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

	it('404 - Criar colmeia com apiario inexistente', async () => {
		const res = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({
			nome: 'Colmeia Teste',
			apiarioId: -1
		})

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})

const atualizacaoColmeia = {
	estadoCriaNova: {
		localizada: 'SIM',
		quantidade: 'POUCA CRIA',
		estado: 'CRIA EM OVOS',
	},
	estadoCriaMadura: {
		localizada: 'SIM',
		quantidade: 'MUITA CRIA',
		estado: 'CRIA MADURA CLARAS',
	},
	estadoMel: {
		localizada: 'SIM',
		quantidade: 'MUITO MEL',
		estado: 'MEL VERDE',
	},
	estadoPolen: {
		localizada: 'VERIFICAÇÃO NÃO POSSIVEL',
	},
	estadoRainha: {
		localizada: 'NÃO',
		estado: 'RAINHA COM IDADE CONHECIDA',
	}
}

describe('GET /colmeias', () => {
	let app
	let token
	let apiarioId
	let colmeias = []

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({})
		await db.default.colmeias.deleteMany({})

		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias',
			email: 'teste_get_colmeias@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_get_colmeias@email.com',
			senha: '12345678'
		})

		token = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Colmeias',
		})

		apiarioId = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })
		colmeias.push(res3.body.id)

		const res4 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })
		colmeias.push(res4.body.id)

		const res5 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })
		colmeias.push(res5.body.id)
	})

	it('200 - Obter lista de colmeias', async () => {
		const res = await request(app).get(`/colmeias?apiarioId=${apiarioId}`).set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(3)
		expect(res.body[0]).toHaveProperty('id')
		expect(res.body[0]).toHaveProperty('numero')
		expect(res.body[0]).toHaveProperty('apiarioId')
	})

	it('400 - Obter lista de colmeias com apiarioId inválido', async () => {
		const res = await request(app).get('/colmeias?apiarioId=a').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('403 - Obter lista de colmeias de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias II',
			email: 'teste_get_colmeias_2@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_get_colmeias_2@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Colmeias 2',
		})

		const apiarioId2 = res2.body.id

		await request(app).post('/colmeias').set('Authorization', `Bearer ${token2}`).send({ apiarioId: apiarioId2 })

		const res4 = await request(app).get(`/colmeias?apiarioId=${apiarioId2}`).set('Authorization', `Bearer ${token}`)

		expect(res4.status).toBe(403)
		expect(res4.body).toHaveProperty('mensagem')
	})

	it('404 - Obter lista de colmeias com apiarioId inexistente', async () => {
		const res = await request(app).get('/colmeias?apiarioId=-1').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})

describe('GET /colmeias/:id', () => {
	let app
	let token
	let apiarioId
	let colmeiaId

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({})
		await db.default.colmeias.deleteMany({})

		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias',
			email: 'teste_get_colmeias@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_get_colmeias@email.com',
			senha: '12345678'
		})

		token = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Colmeias',
		})

		apiarioId = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })

		colmeiaId = res3.body.id

		await request(app).patch(`/colmeias/${colmeiaId}`).set('Authorization', `Bearer ${token}`).send(atualizacaoColmeia)
	})

	it('200 - Obter informações de uma colmeia', async () => {
		const res = await request(app).get(`/colmeias/${colmeiaId}`).set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('id')
		expect(res.body).toHaveProperty('numero')
		expect(res.body).toHaveProperty('apiarioId')
		expect(res.body).toHaveProperty('estadoCriaNova')
		expect(res.body).toHaveProperty('estadoCriaMadura')
		expect(res.body).toHaveProperty('estadoMel')
		expect(res.body).toHaveProperty('estadoPolen')
		expect(res.body).toHaveProperty('estadoRainha')
	})

	it('200 - Obter informações de uma colmeia com dados de estado vazios', async () => {
		const res = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })

		const colmeiaId2 = res.body.id

		const res2 = await request(app).get(`/colmeias/${colmeiaId2}`).set('Authorization', `Bearer ${token}`)

		expect(res2.status).toBe(200)
		expect(res2.body).toHaveProperty('id')
		expect(res2.body).toHaveProperty('numero')
		expect(res2.body).toHaveProperty('apiarioId')
		expect(res2.body).toHaveProperty('estadoCriaNova')
		expect(res2.body).toHaveProperty('estadoCriaMadura')
		expect(res2.body).toHaveProperty('estadoMel')
		expect(res2.body).toHaveProperty('estadoPolen')
		expect(res2.body).toHaveProperty('estadoRainha')
	})

	it('400 - Obter informações de uma colmeia com id inválido', async () => {
		const res = await request(app).get('/colmeias/a').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('403 - Obter informações de uma colmeia de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias II',
			email: 'teste_get_colmeias_2@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_get_colmeias_2@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Colmeias 2',
		})

		const apiarioId2 = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token2}`).send({ apiarioId: apiarioId2 })

		const colmeiaId2 = res3.body.id

		const res4 = await request(app).get(`/colmeias/${colmeiaId2}`).set('Authorization', `Bearer ${token}`)

		expect(res4.status).toBe(403)
		expect(res4.body).toHaveProperty('mensagem')
	})

	it('404 - Obter informações de uma colmeia inexistente', async () => {
		const res = await request(app).get('/colmeias/-1').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})

describe('PATCH /colmeia/:id', () => {
	let app
	let token
	let apiarioId
	let colmeiaId

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

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })

		colmeiaId = res3.body.id
	})

	it('200 - Atualizar informações de uma colmeia', async () => {
		const res = await request(app).patch(`/colmeias/${colmeiaId}`).set('Authorization', `Bearer ${token}`).send(atualizacaoColmeia)

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Atualizar informações de uma colmeia com dados inválidos', async () => {
		const atualizacaoColmeiaInvalida = {
			estadoCriaNova: {
				localizada: 'SIM',
				quantidade: 'MUITA CRIA',
				estado: 'CRIA EM PUPAS',
			},
			estadoCriaMadura: {}
		}

		const res = await request(app).patch(`/colmeias/${colmeiaId}`).set('Authorization', `Bearer ${token}`).send(atualizacaoColmeiaInvalida)

		expect(res.status).toBe(400)
		expect(res.body).toBeInstanceOf(Array)
		expect(res.body.length).toBe(1)
	})

	it('400 - Atualizar informações de uma colmeia com id inválido', async () => {
		const res = await request(app).patch('/colmeias/a').set('Authorization', `Bearer ${token}`).send(atualizacaoColmeia)

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('403 - Atualizar informações de uma colmeia de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias III',
			email: 'teste_colmeias_3@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_colmeias_3@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Colmeias 3',
		})

		const apiarioId2 = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token2}`).send({ apiarioId: apiarioId2 })

		const colmeiaId2 = res3.body.id

		const res4 = await request(app).patch(`/colmeias/${colmeiaId2}`).set('Authorization', `Bearer ${token}`).send(atualizacaoColmeia)

		expect(res4.status).toBe(403)
		expect(res4.body).toHaveProperty('mensagem')
	})

	it('404 - Atualizar informações de uma colmeia inexistente', async () => {
		const res = await request(app).patch('/colmeias/-1').set('Authorization', `Bearer ${token}`).send(atualizacaoColmeia)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})

describe('DELETE /colmeias/:id', () => {
	let app
	let token
	let apiarioId
	let colmeiaId

	beforeAll(async () => {
		app = await construirApp

		await db.default.apiarios.deleteMany({})
		await db.default.colmeias.deleteMany({})

		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias',
			email: 'teste_delete_colmeia@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_delete_colmeia@email.com',
			senha: '12345678'
		})

		token = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token}`).send({
			nome: 'Teste Colmeias',
		})

		apiarioId = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token}`).send({ apiarioId: apiarioId })

		colmeiaId = res3.body.id
	})

	it('200 - Remover uma colmeia', async () => {
		const res = await request(app).delete(`/colmeias/${colmeiaId}`).set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('400 - Remover uma colmeia com id inválido', async () => {
		const res = await request(app).delete('/colmeias/a').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(400)
		expect(res.body).toHaveProperty('mensagem')
	})

	it('403 - Remover uma colmeia de outro usuário', async () => {
		await request(app).post('/usuarios').send({
			nome: 'Teste Colmeias III',
			email: 'teste_delete_colmeia_2@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_delete_colmeia_2@email.com',
			senha: '12345678'
		})

		const token2 = res.body.token

		const res2 = await request(app).post('/apiarios').set('Authorization', `Bearer ${token2}`).send({
			nome: 'Teste Colmeias 3',
		})

		const apiarioId2 = res2.body.id

		const res3 = await request(app).post('/colmeias').set('Authorization', `Bearer ${token2}`).send({ apiarioId: apiarioId2 })

		const colmeiaId2 = res3.body.id

		const res4 = await request(app).delete(`/colmeias/${colmeiaId2}`).set('Authorization', `Bearer ${token}`)

		expect(res4.status).toBe(403)
		expect(res4.body).toHaveProperty('mensagem')
	})

	it('404 - Remover uma colmeia inexistente', async () => {
		const res = await request(app).delete('/colmeias/-1').set('Authorization', `Bearer ${token}`)

		expect(res.status).toBe(404)
		expect(res.body).toHaveProperty('mensagem')
	})
})


