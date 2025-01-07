import express from 'express'
import { router as userRouter } from './UserRoutes.js'
import { router as postRouter } from './PostRoutes.js'

export const router = express.Router()

router.use('/user', userRouter)
router.use('posts', postRouter)
