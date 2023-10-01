import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: 'prod.env' })
}
else if (process.env.NODE_ENV === 'test') {
	dotenv.config({ path: 'test.env' })
}
else {
	dotenv.config({ path: '.env' })
}

const config: VariaveisAmbiente = {
	NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
	PORT: parseInt(process.env.PORT as string),
	CORS_ORIGIN: (process.env.CORS_ORIGIN as string).split(','),
	DB_URI: process.env.DB_URI as string,
	JWT_TOKEN: process.env.JWT_TOKEN as string,
	API_TOKEN: process.env.API_TOKEN as string,
	API_BASE: process.env.API_BASE as string,
	SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS as string),
	EMAIL_HOST: process.env.EMAIL_HOST as string,
	EMAIL_PORT: parseInt(process.env.EMAIL_PORT as string),
	EMAIL_USER: process.env.EMAIL_USER as string,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
}

export default config