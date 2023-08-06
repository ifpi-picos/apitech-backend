const request = require('supertest')
const { construirApp } = require('../../dist/app')
const verficarToken = require('../../dist/middlewares/verificarToken.middleware.js')

describe('Função verificarToken', () => {
	let app
	let tokenValido

	let mockRequest
	let mockResponse
	let nextFunction = jest.fn()

	beforeAll(async () => {
		app = await construirApp

		await request(app).post('/usuarios').send({
			nome: 'Teste Verificar Token',
			email: 'teste_verificar_token@email.com',
			senha: '12345678'
		})

		const res = await request(app).post('/login').send({
			email: 'teste_verificar_token@email.com',
			senha: '12345678'
		})

		tokenValido = res.body.token
	})

	it('Verificar o token e adicionar o usuário ao req.usuario', async () => {
		mockRequest = {
			method: 'GET',
			path: '/teste',
			headers: {
				'authorization': `Bearer ${tokenValido}`
			},
			usuario: jest.fn()
		}

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		}

		const expectedResponse = {
			id: expect.any(Number),
			nome: expect.any(String),
			email: expect.any(String),
		}

		await verficarToken.verificarToken(mockRequest, mockResponse, nextFunction)

		expect(mockRequest.usuario).toEqual(expectedResponse)
		expect(nextFunction).toHaveBeenCalled()
	})

	it('Ignorar a verificação do token quando o método e caminho forem de uma rota pré-definida', async () => {
		mockRequest = {
			method: 'POST',
			path: '/login',
		}

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		}

		await verficarToken.verificarToken(mockRequest, mockResponse, nextFunction)

		expect(nextFunction).toHaveBeenCalled()
	})

	it('Retornar erro 401 quando o token não for enviado', async () => {
		mockRequest = {
			method: 'GET',
			path: '/teste',
			headers: {},
			usuario: jest.fn()
		}

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		}

		const expectedResponse = {
			mensagem: 'Token não informado'
		}

		await verficarToken.verificarToken(mockRequest, mockResponse, nextFunction)

		expect(mockResponse.status).toHaveBeenCalledWith(401)
		expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse)
	})

	it('Retornar erro 401 quando o token não for válido', async () => {
		mockRequest = {
			method: 'GET',
			path: '/teste',
			headers: {
				'authorization': 'Bearer token_invalido'
			},
			usuario: jest.fn()
		}

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		}

		const expectedResponse = {
			mensagem: 'Token inválido'
		}

		await verficarToken.verificarToken(mockRequest, mockResponse, nextFunction)

		expect(mockResponse.status).toHaveBeenCalledWith(401)
		expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse)
	})

	it('Retornar erro 400 quando o tipo de token não for válido', async () => {
		mockRequest = {
			method: 'GET',
			path: '/teste',
			headers: {
				'authorization': `${tokenValido}`
			},
			usuario: jest.fn()
		}

		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		}

		const expectedResponse = {
			mensagem: 'Tipo de token inválido'
		}

		await verficarToken.verificarToken(mockRequest, mockResponse, nextFunction)

		expect(mockResponse.status).toHaveBeenCalledWith(400)
		expect(mockResponse.json).toHaveBeenCalledWith(expectedResponse)
	})

})