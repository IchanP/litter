import express from 'express'
import { FollowController } from '../controller/FollowController'
export const router = express.Router()

// TODO dependencies
const controller = new FollowController()

router.post('/:id', (req, res, next) => controller.followUser(req, res, next))
