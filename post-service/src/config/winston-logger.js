import winston from 'winston'
const { combine, timestamp, json, colorize, printf } = winston.format

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: 'app.log',
      silent: process.env.NODE_ENV !== 'production'
    }),
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`
        })
      ),
      silent: process.env.NODE_ENV === 'test'
    })
  ]
})

export { logger }
