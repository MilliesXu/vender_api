import ProductModel from "../models/ProductModel";

import { CreateProductInput } from '../schemas/productSchema';

export const createProductService = async (data: CreateProductInput, userId: string) => {
  const product = await ProductModel.create({
    ...data,
    user: userId
  })

  return product.populate('user', { firstname: 1, lastname: 1 })
}