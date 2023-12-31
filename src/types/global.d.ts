import { CriaLocalizada, QuantidadeCria, EstadoCriaNova, EstadoCriaMadura, MelLocalizado, QuantidadeMel, EstadoMel, PolenLocalizado, QuantidadePolen, RainhaLocalizada, EstadoRainha, AspectoRainha } from './enums'

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
        EMAIL_HOST: string
        EMAIL_PORT: number
        EMAIL_USER: string
        EMAIL_PASSWORD: string
    }

    type Usuario = {
        id: number
        nome: string
        email: string
        senha: string
    }

    type Apiario = {
        id: number
        nome: string
        usuarioId: number
    }

    type Colmeia = {
        id: number
        numero: number
        apiarioId: number
    }

    type ColmeiaHistorico = {
        id: number
        colmeiaId: number
        data: Date
        estadoCriaNova?: {
            localizada: CriaLocalizada
            quantidade?: QuantidadeCria
            estado?: EstadoCriaNova
        }
        estadoCriaMadura?: {
            localizada: CriaLocalizada
            quantidade?: QuantidadeCria
            estado?: EstadoCriaMadura
        }
        estadoMel?: {
            localizada: MelLocalizado
            quantidade?: QuantidadeMel
            estado?: EstadoMel
        }
        estadoPolen?: {
            localizada: PolenLocalizado
            quantidade?: QuantidadePolen
        }
        estadoRainha?: {
            localizada: RainhaLocalizada
            estado?: EstadoRainha
            aspecto?: AspectoRainha
        }
    }

    type UsuarioPreCadastro = {
        nome: string
        email: string
        senha: string
    }

    type UsuarioPreModificacao = {
        nome?: string
        email?: string
        senha?: string
    }

    type ApiarioPreCadastro = {
        nome: string
        usuarioId: number
    }

    type ApiarioPreModificacao = {
        nome?: string
        usuarioId: number
    }

    type ColmeiaPreCadastro = {
        numero: number
        apiarioId: number
    }

    type ColmeiaPreModificacao = {
        estadoCriaNova?: {
            localizada?: CriaLocalizada
            quantidade?: QuantidadeCria
            estado?: EstadoCriaNova
        }
        estadoCriaMadura?: {
            localizada?: CriaLocalizada
            quantidade?: QuantidadeCria
            estado?: EstadoCriaMadura
        }
        estadoMel?: {
            localizada?: MelLocalizado
            quantidade?: QuantidadeMel
            estado?: EstadoMel
        }
        estadoPolen?: {
            localizada?: PolenLocalizado
            quantidade?: QuantidadePolen
        }
        estadoRainha?: {
            localizada?: RainhaLocalizada
            estado?: EstadoRainha
            aspecto?: AspectoRainha
        }
    }

    type CodigoRecuperacao = {
        id: number
        codigo: string
        usuarioId: number
        expiraEm: Date
    }

    type CodigoRecuperacaoPreCadastro = {
        codigo: string
        usuarioId: number
        expiraEm: Date
    }

    namespace Express {
        interface Request {
            startTime: number
            usuario?: {
                id: number
                nome: string
                email: string
            }
        }
    }
}

export { }