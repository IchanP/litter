import express from 'express'
import { UserController } from '../controller/userController.js'
import { UserService } from '../service/UserService.js'
import { UserRepository } from '../repositories/UserRepository.js'
// import { MessageBroker } from '../service/MessageBroker.js'

export const router = express.Router()

// NOTE - Should really use inversify but can't set it up using javascript.
const userRepository = new UserRepository()
// const broker = new MessageBroker()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

// Routes
router.get('/search', (req, res, next) => userController.searchUsers(req, res, next))
router.get('/:id/following', (req, res, next) => userController.getFollowing(req, res, next))
router.get('/:id', (req, res, next) => userController.getUser(req, res, next))
