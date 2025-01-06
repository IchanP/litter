import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer {token}"

    if (!token) {
        return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lägg decoded JWT-data i förfrågan
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};