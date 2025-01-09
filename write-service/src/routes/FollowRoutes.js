import express from 'express'
import { FollowController } from '../controller/FollowController.js'
import { FollowService } from '../service/FollowService.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { FollowRepository } from '../repositories/FollowRepository.js'
import { MessageBroker } from '../service/MessageBroker.js'
export const router = express.Router()

// TODO dependencies
const followRepo = new FollowRepository()
const userRepo = new UserRepository()
const broker = new MessageBroker()
const service = new FollowService(followRepo, userRepo, broker)
const controller = new FollowController(service)

router.post('/:id', (req, res, next) => controller.followUser(req, res, next))
