import config from './config/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { verificarConexao } from './config/database'
import middlewares from './middlewares'
import routes from './routes'
import { cacheCodigos } from './utils/codigosRecuperacao.util'

const app = express()

const configurarExpress = () => {
	app.set('trust proxy', true)
	app.use(helmet())
	app.use(
		cors({
			origin: config.CORS_ORIGIN,
		})
	)
	app.use(express.json())
	app.use(middlewares)
	app.use(config.API_BASE, routes)

	//Iniciando cache de recuperação
	cacheCodigos.length()

	return app
}

const construirApp = verificarConexao().then(configurarExpress)

export { construirApp }