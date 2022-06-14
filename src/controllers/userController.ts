import { Request, Response, NextFunction } from 'express'
import { MyError } from '../middlewares/errorHandler';

import { createUserService, getUserByIdService, getUsersService, updateUserProfileService, verifyUserService } from '../services/userService';
import { CreateUserInput, UpdateUserInput, VerificationUserParams } from '../schemas/userSchema';
import sendMail from '../utils/mailer';

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsersService()
    res.send(users)
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const getUserProfileHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.userId

    const user = await getUserByIdService(userId)
    if (!user) throw new MyError('Not authorized', 401)
    if (!user.verified) throw new MyError('User is not verified', 403)

    res.send({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const createUserHandler = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const user = await createUserService(body)
    await sendMail({
      from: 'test@gmail.com',
      to: user.email,
      subject: 'Verified your email',
      text: `Id = ${user._id}, verification code = ${user.verificationCode}`
    })

    return res.send({
      successMessage: 'A verification email has been sent'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const verificationUserHandler = async (req: Request<VerificationUserParams>, res: Response, next: NextFunction) => {
  try {
    const { id, verificationCode } = req.params
    const user = await getUserByIdService(id)
    if (!user) throw new MyError('Not authorized', 401)
    const verifieduser = await verifyUserService(user, verificationCode)
    res.statusMessage = 'Successfully verified your account'
    res.send({
      userInfo: {
        firstname: verifieduser.firstname,
        lastname: verifieduser.lastname,
        verified: verifieduser.verified,
      },
      successMessage: 'Successfully verified your account'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const updateUserProfileHandler = async (req: Request<{}, {}, UpdateUserInput>, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const user = await getUserByIdService(res.locals.user.userId)
    if (user) {
      if (user.verified) {
        await updateUserProfileService(user, body)
      } else {
        throw new MyError('Cannot update user that is not verified', 403)
      }
    }

    res.send({
      userInfo: {
        firstname: user?.firstname,
        lastname: user?.lastname,
        verified: user?.verified
      },
      successMessage: 'Successfully update user profile'
    })
  } catch (error: any) {
    if (error.code === 11000) next(new MyError('Email is already been used', 400))
    next(new MyError(error.message, error.code))
  }
}
