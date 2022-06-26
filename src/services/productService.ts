import { MyError } from "../middlewares/errorHandler";
import ProductModel, { ProductDocument } from "../models/ProductModel";
import { CreateProductInput, UpdateProduct } from '../schemas/productSchema';

export const createProductService = async (data: CreateProductInput, userId: string) => {
  const product = await ProductModel.create({
    ...data,
    user: userId
  })

  await product.populate('lines')
  await product.populate('user', { firstname: 1, lastname: 1, _id: 0 })

  return product
}

export const findOneProductService = async (productId: string) => {
  const product = await ProductModel.findById(productId).populate('user', { firstname: 1, lastname: 1, _id: 0 })
  if (!product) throw new MyError('Product not found', 404)
  
  return product
}

export const findAllProductService = async () => {
  const products = await ProductModel.find().populate('user', { firstname: 1, lastname: 1, _id: 0 })
  await ProductModel.updateOne()
  
  return products
}

export const updateProductService = async (product: ProductDocument, data: UpdateProduct['body']) => {
  product.name = data.name
  product.description = data.description
  await product.save()

  return product
}

export const deleteProductService = async (product: ProductDocument) => {
  return await product.delete()
}
