import { DateTime } from 'luxon'
import LogHandler from '../logs'

interface Logger {
    arquivoLogs: string
    atualizarArquivoLogs(log: string): void
    registrarErro(erro: unknown): void
    procurarArquivoLogs(data: DateTime): Buffer | false
}

const logger: Logger = new LogHandler()

export default logger