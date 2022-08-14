import express, { Express }  from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export default (app: Express) => {
  app.use(cors({origin: process.env.CROSS_ORIGIN as string}))
  app.use(cookieParser())
  app.use(express.json())

  return app
}
