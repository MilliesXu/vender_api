import express from 'express'

import { getUserProfileHandler, createUserHandler, verificationUserHandler } from '../controllers/userController'
import { createUserSchema } from '../schemas/userSchema'
import validateRequest from '../middlewares/validateRequest'
import deserializeUser from '../middlewares/deserializeUser'

const userRoute = express.Router()

userRoute.get('/', deserializeUser, getUserProfileHandler)
userRoute.post('/', validateRequest(createUserSchema), createUserHandler)
userRoute.get('/:id/:verificationCode', verificationUserHandler)

export default userRoute
