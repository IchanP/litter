import express from 'express'
import helmet from 'helmet'
import morganLogger from 'morgan'
import { logger } from './config/winston-logger.js'
import { connectToDatabase } from './config/mongoose.js'
// import { connectBroker } from './config/kafka.js'
import { router } from './routes/router.js'

try {
  const app = express()
  // TODO connect to database here
  await connectToDatabase(process.env.POST_DB_CONNECTION_STRING)
  // await connectBroker(process.env.MESSAGE_BROKER_CONNECTION_STRING)

  app.use(express.json())
  app.use(helmet())
  app.use(morganLogger('dev'))
  app.use('/', router)

  // Error handling
  app.use(function (err, req, res, next) {
    err.status = err.status || 500
    if (err.status === 400) {
      err.message = err.essage || 'The request cannot or will not be processed due to something that is perceived to be a client error (for example validation error).'
      // Catch for all errors that are not set
      if (err.status === 500) {
        err.message = 'An unexpected condition was encountered.'
      }
    }

    return res.status(err.status).json({ status: err.status, message: err.message })
  })

  const server = app.listen(process.env.PORT, () => {
    logger.info(`Server running at http://localhost:${server.address().port}`)
    logger.info('Press Ctrl-C to terminate...')
  })
} catch (e) {
  logger.error(e.message)
  process.exitCode = 1
}
