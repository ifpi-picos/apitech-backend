export { }

declare global {
    type VariaveisAmbiente = {
        NODE_ENV: 'development' | 'production' | 'test'
        PORT: number
        CORS_ORIGIN: string | string[]
        DB_URI: string
        JWT_TOKEN: string
        API_TOKEN: string
        API_BASE: string
        SALT_ROUNDS: number
    }
}