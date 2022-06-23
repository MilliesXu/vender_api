import { Request, Response, NextFunction } from 'express'

import { MyError } from '../middlewares/errorHandler';
import { CreateProductInput, FindOneProductParams, UpdateProduct } from '../schemas/productSchema';
import { createProductService, deleteProductService, findAllProductService, findOneProductService, updateProductService } from '../services/productService';

export const createProductHandler = async (req: Request<{}, {}, CreateProductInput>, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const userId = res.locals.user.userId
    const product = await createProductService(body, userId)

    res.send({
      productInfo: product,
      successMessage: 'Successfully create a product'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const findOneProductHandler = async (req: Request<FindOneProductParams>, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params
    const product = await findOneProductService(productId)
    
    res.send({
      productInfo: product,
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const findProductsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productArray = await findAllProductService()

    res.send({
      products: productArray
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const updateProductHandler = async (req: Request<UpdateProduct['params'], {}, UpdateProduct['body']>, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params
    const body = req.body

    const product = await findOneProductService(productId)
    const updateProduct = await updateProductService(product, body)

    res.send({
      productInfo: updateProduct,
      successMessage: 'Successfully update product'
    })

  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const deleteProductHandler = async (req: Request<FindOneProductParams>, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params

    const product = await findOneProductService(productId)
    await deleteProductService(product)

    res.send({
      successMessage: 'Successfully delete product'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}
