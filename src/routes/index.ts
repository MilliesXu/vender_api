import { Express } from 'express'

import authRoute from './authRoute'
import userRoute from './userRoute'

export default(app: Express) => {
  app.use('/api/auth', authRoute)
  app.use('/api/user', userRoute)
}
