import express from 'express'
import { router as userRouter } from './UserRoutes.js'

export const router = express.Router()

router.use('/user', userRouter)
