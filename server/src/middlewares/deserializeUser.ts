import { Request, Response, NextFunction } from 'express'
import { verifyJWT } from '../utils/jwt'
import { MyError } from './errorHandler'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accessToken } = req.cookies

    if (!accessToken) throw new MyError('Unauthorized', 401)

    const decoded = verifyJWT(accessToken, 'ACCESS_TOKEN_PUBLIC')

    if (!decoded) throw new MyError('Unauthrozied', 401)

    res.locals.user = decoded

    next()
  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}

export default deserializeUser