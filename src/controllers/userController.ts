import { Request, Response, NextFunction } from 'express'
import { MyError } from '../middlewares/errorHandler';

import { createUserService, getUserByIdService, getUsersService, verifyUserService } from '../services/userService';
import { CreateUserInput, VerificationUserParams } from '../schemas/userSchema';
import sendMail from '../utils/mailer';

export const getUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsersService()
    res.send(users)
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
    if (!user) throw new MyError('Cannot verified user', 400)
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
