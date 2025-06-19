import express from 'express'
import { UserController } from '../controller/UserController.js'
import { UserService } from '../service/UserService.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { MessageBroker } from '../service/MessageBroker.js'
export const router = express.Router()

// NOTE - Should really use inversify but can't set it up using javascript.
const userRepo = new UserRepository()
const broker = new MessageBroker()
const userService = new UserService(userRepo, broker)
const controller = new UserController(userService)

router.post('/register', (req, res, next) => controller.register(req, res, next))
