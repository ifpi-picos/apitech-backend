import { Router } from 'express'
import UsuariosRoute from './usuarios.route'
import AutenticacaoRoute from './autenticacao.route'
import ApiarioRoute from './apiarios.route'

const router = Router()

router.use('/usuarios', UsuariosRoute)
router.use('/', AutenticacaoRoute)
router.use('/apiarios', ApiarioRoute)

export default router