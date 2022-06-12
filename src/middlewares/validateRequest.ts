import { Request, Response, NextFunction } from 'express'
import { AnyZodObject, ZodError } from 'zod'
import { MyError } from './errorHandler'

const validateRequest = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query
    })
    next()
  } catch (error: any) {
    const message = error.errors.map((err: ZodError) => err.message)
    next(new MyError(message, 400))
  }
}

export default validateRequest