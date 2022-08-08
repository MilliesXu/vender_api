import { Request, Response, NextFunction } from 'express'

export class MyError extends Error {
  private errorCode: number

  constructor (message: string, errorCode: number) {
    super(message)
    this.errorCode = errorCode
  }
}

type AsyncHandler<R, Q, P, L extends Record<string, any>> = (
  req: Request<P, {}, R, Q>,
  res: Response<{}, L>,
  next: NextFunction
) => Promise<void>;

type WrappedHandler<R, Q, P, L extends Record<string, any>> = (
  ...args: Parameters<AsyncHandler<R, Q, P, L>>
) => void;

export const catchAsync = <ReqBody = unknown, ReqQuery = qs.ParsedQs, Params = Record<string, string>, Locals extends Record<string, any> = Record<string, any>> (fn: AsyncHandler<ReqBody, ReqQuery, Params, Locals>): WrappedHandler<ReqBody, ReqQuery, Params, Locals> => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      if (err.code === 'P2002') next(new MyError('Conflict, same data has been used', 400))

      next(err)
    })
  };
} 

const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  const message = err.message ? err.message : 'Internal server error'
  const code = err.errorCode ? err.errorCode : 500

  res.status(code).send({
    errorMessage: message,
    stack: process.env.NODE_ENV as string === 'development' ? err.stack : null
  })
}

export default errorHandler
