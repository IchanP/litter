import express from 'express'
import postRoutes from './postRoutes.js'
import userRoutes from './userRoutes.js'
import writeRoutes from './writeRoutes.js'

const router = express.Router()

router.use('/posts', postRoutes)
router.use('/users', userRoutes)
router.use('/write', writeRoutes)

export default router
