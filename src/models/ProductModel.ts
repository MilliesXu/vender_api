import  mongoose, { Schema, Types, Document } from 'mongoose'

interface iProduct {
  name: string,
  description: string,
  lines: [Types.ObjectId],
  user: Types.ObjectId
}

interface iProductMaterialLine {
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
