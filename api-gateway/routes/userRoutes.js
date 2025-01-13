import express from 'express'

const router = express.Router()

// GET: Sök efter användare
router.get('/search', async (req, res) => {
  const query = req.query.query
  let status
  if (!query) {
    return res.json({ message: 'Query parameter is required' })
  }

  try {
    const response = await fetch(
            `${process.env.USER_SERVICE_URL}/user/search?query=${encodeURIComponent(query)}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
    )

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

// GET: Hämta en användares profil
router.get('/:id', async (req, res) => {
  let status
  try {
    const response = await fetch(
            `${process.env.USER_SERVICE_URL}/user/${req.params.id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
    )

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

export default router
