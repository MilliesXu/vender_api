import { DocumentType } from '@typegoose/typegoose'

import { MyError } from "../middlewares/errorHandler";
import ProductModel, { Product } from "../models/ProductModel";
import { CreateProductInput, UpdateProduct } from '../schemas/productSchema';

export const createProductService = async (data: CreateProductInput, userId: string) => {
  const product = await ProductModel.create({
    ...data,
    user: userId
  })

  return product.populate('user', { firstname: 1, lastname: 1, _id: 0 })
}

export const findOneProductService = async (productId: string) => {
  const product = await ProductModel.findById(productId).populate('user', { firstname: 1, lastname: 1, _id: 0 })
  if (!product) throw new MyError('Product not found', 404)
  
  return product
}

export const findAllProductService = async () => {
  const products = await ProductModel.find().populate('user', { firstname: 1, lastname: 1, _id: 0 })
  
  return products
}

export const updateProductService = async (product: DocumentType<Product>, data: UpdateProduct['body']) => {
  product.name = data.name
  product.description = data.description
  await product.save()

  return product
}

export const deleteProductService = async (product: DocumentType<Product>) => {
  return await product.delete()
}
