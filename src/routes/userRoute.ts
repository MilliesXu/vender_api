import express from 'express'

import { getUserProfileHandler, createUserHandler, verificationUserHandler, updateUserProfileHandler, requestChangePasswordHandler, changePasswordHandler } from '../controllers/userController'
import { createUserSchema, requestChangePasswordSchema, updateUserSchema, changePasswordSchema } from '../schemas/userSchema'
import validateRequest from '../middlewares/validateRequest'
import deserializeUser from '../middlewares/deserializeUser'

const userRoute = express.Router()

userRoute.get('/', deserializeUser, getUserProfileHandler)
userRoute.post('/', validateRequest(createUserSchema), createUserHandler)
userRoute.get('/:id/:verificationCode', verificationUserHandler)
userRoute.put('/', deserializeUser, validateRequest(updateUserSchema), updateUserProfileHandler)
userRoute.get('/requestResetPassword', validateRequest(requestChangePasswordSchema), requestChangePasswordHandler)
userRoute.post('/resetPassword/:userId/:passwordResetCode', validateRequest(changePasswordSchema), changePasswordHandler)

export default userRoute
