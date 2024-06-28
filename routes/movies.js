import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'

const router = Router()

router.get('/', MovieController.getAll)

router.get('/:id', MovieController.getById)

router.post('/', MovieController.create)

router.delete('/:id', MovieController.delete)

router.patch('/:id', MovieController.update)

export default router