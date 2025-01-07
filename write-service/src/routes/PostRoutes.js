import express from 'express'
import { PostController } from '../controller/PostController.js'
import { PostService } from '../service/PostService.js'
import { PostRepository } from '../repositories/PostRepository.js'
export const router = express.Router()

const postRepo = new PostRepository()
const postService = new PostService(postRepo)
const controller = new PostController(postService)

router.post('/create', (req, res, next) => controller.createPost(req, res, next))
