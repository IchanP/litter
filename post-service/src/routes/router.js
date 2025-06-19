import express from 'express'
import { router as postRouter } from './PostRoutes.js'

export const router = express.Router()

router.use('/post', postRouter)
