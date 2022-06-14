import express from 'express'

import { getUserProfileHandler, createUserHandler, verificationUserHandler, updateUserProfileHandler } from '../controllers/userController'
import { createUserSchema, updateUserSchema } from '../schemas/userSchema'
import validateRequest from '../middlewares/validateRequest'
import deserializeUser from '../middlewares/deserializeUser'

const userRoute = express.Router()

userRoute.get('/', deserializeUser, getUserProfileHandler)
userRoute.post('/', validateRequest(createUserSchema), createUserHandler)
userRoute.get('/:id/:verificationCode', verificationUserHandler)
userRoute.put('/', deserializeUser, validateRequest(updateUserSchema), updateUserProfileHandler)

export default userRoute
