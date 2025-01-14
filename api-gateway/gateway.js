import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import path from 'path'
import cors from 'cors'

dotenv.config()
try {
  const app = express()

  // In your gateway server
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
  }))

  // Middleware för säkerhet och loggning
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' } // Modify helmet config to work with CORS
  }))
  app.use(morgan('dev'))
  app.use(express.json())

  app.options('*', cors())

  // Koppla alla routes
  app.use('/', routes)

  // Starta API Gateway
  const PORT = process.env.GATEWAY_PORT || 3000
  app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`)
    console.log('Press ctrl+c to cancel...')
  })
} catch (e) {
  console.error(e.message)
  process.exitCode = 1
}
