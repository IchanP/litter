import express from 'express'
import { PostController } from '../controller/PostController.js'
import { PostService } from '../service/PostService.js'
import { PostRepository } from '../repositories/PostRepository.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { MessageBroker } from '../service/MessageBroker.js'
export const router = express.Router()

const postRepo = new PostRepository()
const userRepo = new UserRepository()
const broker = new MessageBroker()
const postService = new PostService(postRepo, userRepo, broker)
const controller = new PostController(postService)

router.post('/create', (req, res, next) => controller.createPost(req, res, next))
