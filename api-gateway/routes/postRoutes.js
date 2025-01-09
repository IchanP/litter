import express from 'express'
import { validateJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET: Hämta användares inlägg
router.get('/:id/posts', validateJWT, async (req, res) => {
  try {
    const response = await fetch(`${process.env.POST_SERVICE_URL}/posts/${req.params.id}/posts`, {
      headers: {
        Authorization: req.headers.authorization
      }
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts' })
  }
})

// GET: Hämta användarens feed
router.get('/:id/feed', validateJWT, async (req, res) => {
  try {
    const response = await fetch(`${process.env.POST_SERVICE_URL}/posts/${req.params.id}/feed`, {
      headers: {
        Authorization: req.headers.authorization
      }
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user feed' })
  }
})

export default router
