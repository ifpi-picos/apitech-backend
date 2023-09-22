const request = require('supertest')
const { construirApp } = require('../../dist/app')

/*
type Colmeia = {
    id: number
    numero: number
    apiarioId: number
    estadoCriaNova: {
        localizada: CriaLocalizada
        quantidade?: QuantidadeCria
        estado?: EstadoCriaNova
    }
    estadoCriaMadura: {
        localizada: CriaLocalizada
        quantidade?: QuantidadeCria
        estado?: EstadoCriaMadura
    }
    estadoMel: {
        localizada: MelLocalizado
        quantidade?: QuantidadeMel
        estado?: EstadoMel
    }
    estadoPolen: {
        localizada: PolenLocalizado
        quantidade?: QuantidadePolen
    }
    estadoRainha: {
        localizada: RainhaLocalizada
        estado?: EstadoRainha
        aspecto?: AspectoRainha
    }
}
*/

describe('POST /colmeias', () => {
	let app
    let token
    let apiarioId

	beforeAll(async () => {
		app = await construirApp

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
        expect(res.body).toHaveProperty('mensagem')
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

