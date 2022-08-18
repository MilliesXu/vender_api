import express, { Express }  from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'

export default (app: Express) => {
  app.use(cookieParser())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())
  app.use(cors({origin: process.env.CROSS_ORIGIN as string, credentials: true}))
  app.use(helmet())

  return app
}
