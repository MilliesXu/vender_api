import { Express } from 'express'

import authRoute from './authRoute'
import materialRoute from './materialRoute'
import productRoute from './productRoute'
import userRoute from './userRoute'

export default(app: Express) => {
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
  app.use('/api/product', productRoute)
  app.use('/api/material', materialRoute)
}
