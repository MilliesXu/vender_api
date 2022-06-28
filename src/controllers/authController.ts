import { Request, Response, NextFunction } from 'express'

import { MyError } from '../middlewares/errorHandler';
import { LoginInput } from '../schemas/authSchema';
import { createSessionService, deleteSessionService, findSessionByIdService } from '../services/authService';
import { getUserByEmailValidation, validatePassword } from '../services/userService'
import { signInJWT, verifyJWT } from '../utils/jwt';

export const loginHandler = async (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const user = await getUserByEmailValidation(email)
    await validatePassword(user.id, password)
    const session = await createSessionService(user.id.toString())
    const accessToken = signInJWT({ userId: user.id, sessionId: session._id }, 'ACCESS_TOKEN_PRIVATE')
    const refreshToken = signInJWT({ userId: user.id, sessionId: session._id }, 'REFRESH_TOKEN_PRIVATE')

    res.cookie('accessToken', accessToken, {
      secure: false,
      httpOnly: true
    })
    res.cookie('refreshToken', refreshToken, {
      secure: false,
      httpOnly: true
    })
    return res.send({
      userInfo: {
        firstname: user.firstname,
        lastname: user.lastname,
        verified: user.verified,
      },
      successMessage: 'Successfully login'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionId = res.locals.user.sessionId
    await deleteSessionService(sessionId)

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    return res.send({
      successMessage: 'Successfully logout'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies
    if (!refreshToken) throw new Error('Unauthorized refresh token')
    const decoded = verifyJWT<{ userId: string, sessionId: string }>(refreshToken, 'REFRESH_TOKEN_PUBLIC')
    if (!decoded) throw new Error('Unauthorized refresh token')
    const session = await findSessionByIdService(decoded.sessionId)

    const accessToken = signInJWT({ userId: decoded.userId, sessionId: session._id }, 'ACCESS_TOKEN_PRIVATE')

    res.cookie('accessToken', accessToken, {
      secure: false,
      httpOnly: true
    })

    res.send({
      successMessage: 'Successfully refreshed accessToken'
    })

  } catch (error: any) {
    res.send({
      errorMessage: error.message
    })
  }
}