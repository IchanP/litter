import express from 'express';
import { validateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST: Skapa ett nytt inlägg
router.post('/', validateJWT, async (req, res) => {
    try {
        const response = await fetch(`${process.env.POST_SERVICE_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: req.headers.authorization
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({ message: 'Failed to post post' });
    }
});

// DELETE: Radera ett inlägg
router.delete('/:id', validateJWT, async (req, res) => {
    try {
        const response = await fetch(`${process.env.POST_SERVICE_URL}/posts/${req.params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: req.headers.authorization
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({ message: 'Failed to delete post' });
    }
});

export default router;