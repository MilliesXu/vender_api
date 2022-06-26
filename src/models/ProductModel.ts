import  mongoose, { Schema, Document } from 'mongoose'

interface iProduct {
  name: string,
  description: string,
  lines: Schema.Types.DocumentArray<iProductMaterialLine>,
  user: Schema.Types.ObjectId
}

interface iProductMaterialLine {
  product: Schema.Types.ObjectId,
  material: Schema.Types.ObjectId,
  quantity: number,
  user: Schema.Types.ObjectId
}

const productSchema = new Schema<iProduct>({
  name: {type: String, required: true},
  description: {type: String},
  lines: [{
    type: Schema.Types.ObjectId,
    ref: 'ProductMaterialLine'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const productMaterialLineSchema = new Schema<iProductMaterialLine>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  material: {
    type: Schema.Types.ObjectId,
    ref: 'Material'
  },
  quantity: {type: Number, required: true},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const ProductModel = mongoose.model<iProduct>('Product', productSchema)
export type ProductDocument = iProduct & Document
export type ProdudctMaterialDocument = iProductMaterialLine & Document
export const ProductMaterialLineModel = mongoose.model<iProductMaterialLine>('ProductMaterialLine', productMaterialLineSchema)
export default ProductModel
