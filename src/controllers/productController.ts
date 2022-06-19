import { Request, Response, NextFunction } from 'express'

import { MyError } from '../middlewares/errorHandler';
import { CreateProductInput } from '../schemas/productSchema';
import { createProductService } from '../services/productService';

export const createProductHandler = async (req: Request<{}, {}, CreateProductInput>, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const userId = res.locals.user.userId
    const product = await createProductService(body, userId)

    res.send({
      productInfo: {
        id: product._id,
        name: product.name,
        description: product.description,
        user: product.user
      },
      successMessage: 'Successfully create a product'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}
