import { jest } from '@jest/globals'

jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn()
  }
}))

describe('JWT Validation Middleware', () => {
  let validateJWT
  let jwt

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret'
    const middleware = await import('../middleware/authMiddleware.js')
    const jwtModule = await import('jsonwebtoken')
    validateJWT = middleware.validateJWT
    jwt = jwtModule.default
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 when no token is provided', () => {
    // Arrange
    const req = {
      headers: {}
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    validateJWT(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Access token is missing' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 401 when there is no authorization header value after Bearer prefix', () => {
    const req = {
      headers: {
        authorization: 'Bearer '
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    validateJWT(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Access token is missing' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should return 403 when token is invalid', () => {
    const req = {
      headers: {
        authorization: 'Bearer invalid-token'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token')
    })

    validateJWT(req, res, next)

    expect(jwt.verify).toHaveBeenCalledWith('invalid-token', 'test-secret')
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' })
    expect(next).not.toHaveBeenCalled()
  })

  it('should call next and set user when token is valid', () => {
    const req = {
      headers: {
        authorization: 'Bearer valid-token'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    const next = jest.fn()

    const decodedToken = { userId: '123', username: 'testuser' }
    jwt.verify.mockReturnValue(decodedToken)

    validateJWT(req, res, next)

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret')
    expect(req.user).toEqual(decodedToken)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})
