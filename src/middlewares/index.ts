import express, { Express }  from 'express'
import cookieParser from 'cookie-parser'

export default (app: Express) => {
  app.use(cookieParser())
  app.use(express.json())

  return app
}
