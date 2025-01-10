import express from 'express'
import { validateJWT } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET: Hämta användares inlägg
router.get('/:id/posts', validateJWT, async (req, res) => {
  const { userId } = req.params.id
  let status
  try {
    const response = await fetch(
            `${process.env.POST_SERVICE_URL}/posts/${userId}/posts`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
    )
    /*  */
    if (!response.ok) {
      status = response.status
      const errData = await response.json()
      throw new Error(errData.message)
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(status || 500).json({ message: error.message })
  }
})

// GET: Hämta användarens feed
router.get('/:id/feed', async (req, res) => {
  const { userId } = req.params.id
  let status
  // Steg 1: Hämta följares ID
  try {
    const followedUserIdsResponse = await fetch(`${process.env.USER_SERVICE_URL}/users/${userId}/following`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!followedUserIdsResponse.ok) {
      status = followedUserIdsResponse.status
      const errData = await followedUserIdsResponse.json()
      throw new Error(errData.message)
    }

    const { followedUserIds } = await followedUserIdsResponse.json()

    // Step 2: Hämta inlägg med följares ID
    const feedResponse = await fetch(
            `${process.env.POST_SERVICE_URL}/posts/${userId}/feed`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ followedUserIds })
            })

    if (!feedResponse.ok) {
      status = feedResponse.status
      const errData = await feedResponse.json()
      throw new Error(errData.message)
    }

    const data = await feedResponse.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(status || 500).json({ message: error.message })
  }
})

export default router
