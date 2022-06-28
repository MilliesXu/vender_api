import { MyError } from "../middlewares/errorHandler";
import ProductModel, { ProductDocument, ProductMaterialLineModel } from "../models/ProductModel";
import { CreateProductInput, CreateProductMaterialInput, UpdateProduct } from '../schemas/productSchema';

export const createProductService = async (data: CreateProductInput, userId: string) => {
  const product = await ProductModel.create({
    name: data.name,
    description: data.description,
    user: userId
  })

  if (data.lines) {
    await Promise.all(data.lines.map( async (line) => {
      const materialLine = await createProductMaterialLineService(line, product._id.toString(), userId)
      product.lines.push(materialLine._id)
      await product.save()
    }))
  }

  await product.populate({ 
    path: 'lines',
    model: 'ProductMaterialLine',
    populate: [{  
      path: 'material',
      model: 'Material',
      select: { _id: 1, name: 1, unit_price: 1 }
    }, {
      path: 'user',
      model: 'User',
      select: { firstname: 1, lastname: 1, _id: 0 }
    }] })
  await product.populate('user', { firstname: 1, lastname: 1, _id: 0 })

  return product
}

export const findOneProductService = async (productId: string) => {
  const product = await ProductModel.findById(productId).populate({ 
    path: 'lines',
    model: 'ProductMaterialLine',
    populate: [{  
      path: 'material',
      model: 'Material',
      select: { _id: 1, name: 1, unit_price: 1 }
    }, {
      path: 'user',
      model: 'User',
      select: { firstname: 1, lastname: 1, _id: 0 }
    }] }).populate('user', { firstname: 1, lastname: 1, _id: 0 })
  if (!product) throw new MyError('Product not found', 404)
  
  return product
}

export const findAllProductService = async () => {
  const products = await ProductModel.find().populate('user', { firstname: 1, lastname: 1, _id: 0 }).populate({ 
    path: 'lines',
    model: 'ProductMaterialLine',
    populate: [{  
      path: 'material',
      model: 'Material',
      select: { _id: 1, name: 1, unit_price: 1 }
    }, {
      path: 'user',
      model: 'User',
      select: { firstname: 1, lastname: 1, _id: 0 }
    }] }).populate('user', { firstname: 1, lastname: 1, _id: 0 })
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

export const createProductMaterialLineService = async (data: CreateProductMaterialInput, productId: string, userId: string) => {
  return await ProductMaterialLineModel.create({
    material: data.materialId,
    quantity: data.quantity,
    user: userId
  })
}

export const updateProductMaterialLineService = async () => {
  
}
