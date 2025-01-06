import express from 'express';
import { validateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST: Skapa en ny skrivning
router.post('/register', validateJWT, async (req, res) => {
    try {
        const response = await fetch(`${process.env.WRITE_SERVICE_URL}/user/register`, {
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
        // TODO - Better error handling
        res.status(500).json({ message: 'Failed to create write' });
    }
});

// DELETE: Radera en skrivning
router.delete('posts/:id', validateJWT, async (req, res) => {
    try {
        const response = await fetch(`${process.env.WRITE_SERVICE_URL}/posts/${req.params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: req.headers.authorization
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete write' });
    }
});

export default router;
