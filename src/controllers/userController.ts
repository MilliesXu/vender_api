import { Request, Response, NextFunction } from 'express'
import { MyError } from '../middlewares/errorHandler';

import { changePasswordService, createUserService, getUserByEmailService, getUserByIdService, getUsersService, setPasswordCodeService, updateUserProfileService, verifyUserService } from '../services/userService';
import { ChangePasswordInput, CreateUserInput, RequestChangePassword, UpdateUserInput, VerificationUserParams } from '../schemas/userSchema';
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
    const userId: number = res.locals.user.userId

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
      text: `Id = ${user.id}, verification code = ${user.verificationCode}`
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
    const { userId, verificationCode } = req.params
    const id = parseInt(userId)

    if (id === NaN) throw new MyError('Failed to verified account', 400)

    const verifieduser = await verifyUserService(id, verificationCode)
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
    const userId: number = res.locals.user.userId
    const user = await updateUserProfileService(userId, body)

    res.send({
      userInfo: {
        firstname: user?.firstname,
        lastname: user?.lastname,
        verified: user?.verified
      },
      successMessage: 'Successfully update user profile'
    })
  } catch (error: any) {
    if (error.code === 'P2002') next(new MyError('Email is already been used', 400))
    next(new MyError(error.message, error.code))
  }
}

export const requestChangePasswordHandler = async (req: Request<{}, {}, RequestChangePassword>, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const user = await setPasswordCodeService(email)

    await sendMail({
      from: 'test@gmail.com',
      to: user.email,
      subject: 'Verified your email',
      text: `Id = ${user.id}, reset password code = ${user.passwordResetCode}`
    })

    return res.send({
      successMessage: 'A verification email has been sent'
    })

  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const changePasswordHandler = async (req: Request<ChangePasswordInput['params'], {}, ChangePasswordInput['body']>, res: Response, next: NextFunction) => {
  try {
    const { userId, passwordResetCode } = req.params
    const { password } = req.body
    await changePasswordService(parseInt(userId), passwordResetCode, password)

    res.send({
      successMessage: 'Your password has been changed'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}
