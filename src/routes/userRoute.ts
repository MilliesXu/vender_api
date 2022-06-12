import express from 'express'

import { getUserHandler, createUserHandler, verificationUserHandler } from '../controllers/userController'
import { createUserSchema } from '../schemas/userSchema'
import validateRequest from '../middlewares/validateRequest'

const userRoute = express.Router()

userRoute.get('/', getUserHandler)
userRoute.post('/', validateRequest(createUserSchema), createUserHandler)
userRoute.get('/:id/:verificationCode', verificationUserHandler)

export default userRoute
