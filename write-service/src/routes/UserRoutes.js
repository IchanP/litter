import express from 'express'
import { UserController } from '../controller/UserController'
import { UserService } from '../service/UserService'
export const router = express.Router()

// NOTE - Should really use inversify but can't set it up using javascript.
const userService = new UserService()
const controller = new UserController(userService)

router.post('/register', (req, res, next) => controller.register(req, res, next))
