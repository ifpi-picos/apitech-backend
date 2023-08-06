import { Router } from 'express'
import { verificarToken } from './verificarToken.middleware'
import { logger } from './logger.middleware'

const router = Router()

router.use(verificarToken)
router.use(logger)

export default router