import express from 'express'
import middlewares from '../middlewares'
import errorHandler from '../middlewares/errorHandler'
import routes from '../routes'

export const createServer = () => {
  const app = express()

  middlewares(app)
  routes(app)
  app.use(errorHandler)
  return app
}

