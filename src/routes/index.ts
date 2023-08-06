import { Router } from 'express'
import UsuariosRoute from './usuarios.route'
import AutenticacaoRoute from './autenticacao.route'

const router = Router()

router.use('/usuarios', UsuariosRoute)
router.use('/', AutenticacaoRoute)

export default router