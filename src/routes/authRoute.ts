import express from 'express'

import validateRequest from '../middlewares/validateRequest'
import { loginHandler, logoutHandler, refreshTokenHandler } from '../controllers/authController'
import { loginSchema } from '../schemas/authSchema'
import deserializeUser from '../middlewares/deserializeUser'

const authRoute = express.Router()

authRoute.post('/login', validateRequest(loginSchema), loginHandler)
authRoute.post('/logout', deserializeUser, logoutHandler)
authRoute.get('/refresh', refreshTokenHandler)

export default authRoute
