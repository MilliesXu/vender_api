import { Request, Response, NextFunction } from 'express'

export class MyError extends Error {
  private errorCode: number

  constructor (message: string, errorCode: number) {
    super(message)
    this.errorCode = errorCode
  }
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
