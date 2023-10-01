const gerarCodigo = require('../../dist/utils/codigosRecuperacao.util').default
const request = require('supertest')
const { construirApp } = require('../../dist/app')
const db = require('../../dist/config/database')

describe('Função gerarCodigo', () => {
	let app
	let usuarioId

	beforeAll(async () => {
		app = await construirApp

		await db.default.usuarios.deleteMany({})

		const res = await request(app).post('/usuarios').send({
			nome: 'Teste Gerar Código',
			email: 'teste_gerar_codigo@email.com',
			senha: '12345678'
		})

		usuarioId = res.body.id
	})

	it('Deve gerar um código de 6 digitos único e salvar no banco de dados', async () => {
		const codigo = await gerarCodigo(usuarioId)

		expect(codigo).toHaveLength(6)
		expect(await db.default.codigosRecuperacao.findUnique({ where: { codigo: codigo } })).toBeTruthy()
	})

	it('Deve pegar o código gerado anteriormente para o mesmo usuário', async () => {
		const res = await request(app).post('/usuarios').send({
			nome: 'Teste Gerar Código',
			email: 'teste_gerar_codigo_2@email.com',
			senha: '12345678'
		})

		const codigo = await gerarCodigo(res.body.id)

		expect(codigo).toHaveLength(6)
		expect(await db.default.codigosRecuperacao.findUnique({ where: { codigo: codigo } })).toBeTruthy()

		const codigo2 = await gerarCodigo(res.body.id)

		expect(codigo).toBe(codigo2)
	})
})