import { MyError, catchAsync } from '../middlewares/errorHandler';
import { CreateProductInput, FindOneProductParams, UpdateProduct } from '../schemas/productSchema';
import { createProductService, deleteProductService, findAllProductService, findOneProductService, updateProductService } from '../services/productService';

export const createProductHandler = catchAsync<CreateProductInput>(async (req, res) => {
  const body = req.body
  const userId = res.locals.user.userId
  const product = await createProductService(body, userId)

  res.send({
    productInfo: product,
    successMessage: 'Successfully create a product'
  })
})

export const findOneProductHandler = catchAsync<{}, {}, FindOneProductParams>(async (req, res) => {
  const { productId } = req.params
  const id = parseInt(productId)

  if (id === NaN) throw new MyError('Product not found', 404)
  const product = await findOneProductService(id)
  
  res.send({
    productInfo: product,
  })
})

export const findProductsHandler = catchAsync(async (req, res) => {
  const productArray = await findAllProductService()

  res.send({
    products: productArray
  })
})

export const updateProductHandler = catchAsync<UpdateProduct['body'], {}, UpdateProduct['params']>(async (req, res) => {
  const { productId } = req.params
  const body = req.body
  const userId = res.locals.user.userId
  const id = parseInt(productId)

  if (id === NaN) throw new MyError('Product not found', 404)

  await findOneProductService(id)
  const product = await updateProductService(id, body, userId)

  res.send({
    productInfo: product,
    successMessage: 'Successfully update product'
  })
})

export const deleteProductHandler = catchAsync<{}, {}, FindOneProductParams>(async (req, res) => {
  const { productId } = req.params
  const id = parseInt(productId)

  if (id === NaN) throw new MyError('Product not found', 404)

  const product = await findOneProductService(id)
  await deleteProductService(id)

  res.send({
    successMessage: 'Successfully delete product'
  })
})
