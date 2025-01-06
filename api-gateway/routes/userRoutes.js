import express from 'express';
import { validateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: Hämta en användares profil
router.get('/:id', validateJWT, async (req, res) => {
    try {
        const response = await fetch(`${process.env.USER_SERVICE_URL}/users/${req.params.id}`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
});

// GET: Sök efter användare
router.get('/search', validateJWT, async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.json({ message: 'Query parameter is required' });
    }

    try {
        const response = await fetch(`${process.env.USER_SERVICE_URL}/users/search?query=${encodeURIComponent(query)}`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({ message: 'Failed to search for user' });
    }
});

export default router;
