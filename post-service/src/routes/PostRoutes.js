import express from 'express'
import { PostController } from '../controller/PostController.js'
import { PostService } from '../service/PostService.js'
import { PostRepository } from '../repositories/PostRepository.js'
import { UserService } from '../service/UserService.js'
// import { MessageBroker } from '../service/MessageBroker.js'

export const router = express.Router()

// NOTE - Should really use inversify but can't set it up using javascript.
const postRepository = new PostRepository()
// const broker = new MessageBroker()
const userService = new UserService()
const postService = new PostService(postRepository, userService)
const postController = new PostController(postService)

// Routes
router.get('/:id/posts', (req, res, next) => postController.getUserPosts(req, res, next))
router.post(':id/feed', (req, res, next) => postController.getUserFeed(req, res, next))
