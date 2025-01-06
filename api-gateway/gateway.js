import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import routes from './routes/index.js'

dotenv.config()
try {
  const app = express()

  // Middleware för säkerhet och loggning
  app.use(helmet())
  app.use(morgan('dev'))
  app.use(express.json())

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
