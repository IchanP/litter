import jwt from 'jsonwebtoken'

/**
 * Validates that the passed JWT is ok.
 *
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Next middleware
 * @returns {Response | undefined} - Returns either a 401 or 403 or simply passes it to the next middleware.
 */
export const validateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] // "Bearer {token}"

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Lägg decoded JWT-data i förfrågan
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}
