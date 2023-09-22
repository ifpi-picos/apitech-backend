import config from './config'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
	datasources: {
		db: {
			url: config.DB_URI,
		}
	}
})

async function verificarConexao() {
	return await db.$connect()
}

export default db
export { verificarConexao }