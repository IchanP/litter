import express from 'express'
import { validateJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST: Skapa en ny användare
router.post('/register', async (req, res) => {
  let status
  try {
    const response = await fetch(
      `${process.env.WRITE_SERVICE_URL}/user/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
      }
    )

    if (!response.ok) {
      status = response.status
      const errDAta = await response.json()
      throw new Error(errDAta.message)
    }

    const data = await response.json()
    res.json(data).status(201)
  } catch (error) {
    res.status(status || 500).json({ message: error.message })
  }
})

// POST: Skapa en post
router.delete('posts/create', validateJWT, async (req, res) => {
  let status
  try {
    const response = await fetch(
      `${process.env.WRITE_SERVICE_URL}/posts/${req.params.id}`,
      {
        method: 'POST',
        boyd: JSON.stringify(req.body)
      }
    )

    if (!response.ok) {
      status = response.status
      const errData = await response.json()
      throw new Error(errData.message)
    }
    const data = await response.json()
    res.json(data).status(201)
  } catch (error) {
    res.status(status || 500).json({ message: error.message })
  }
})

// DELETE: Radera en post
router.delete('posts/:id', validateJWT, async (req, res) => {
  let status
  try {
    const response = await fetch(
      `${process.env.WRITE_SERVICE_URL}/posts/${req.params.id}`,
      {
        method: 'DELETE'
      }
    )

    if (!response.ok) {
      status = response.status
      const errDAta = await response.json()
      throw new Error(errDAta.message)
    }

    res.status(203)
  } catch (error) {
    res.status(status || 500).json({ message: error.message })
  }
})

export default router
