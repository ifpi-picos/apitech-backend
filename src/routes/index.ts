import { Router } from 'express'
import UsuariosRoute from './usuarios.route'
import AutenticacaoRoute from './autenticacao.route'
import ApiariosRoute from './apiarios.route'
import ColmeiasRoute from './colmeias.route'

const router = Router()

router.use('/usuarios', UsuariosRoute)
router.use('/', AutenticacaoRoute)
router.use('/apiarios', ApiariosRoute)
router.use('/colmeias', ColmeiasRoute)

export default router