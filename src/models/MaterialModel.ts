import  mongoose, { Schema, Document } from 'mongoose'

export interface iMaterial extends Document {
  name: string,
  description: string,
  uom: string,
  unit_price: number,
  user: Schema.Types.ObjectId
}

const materialSchema = new Schema<iMaterial>({
  name: {type: String, required: true},
  description: {type: String},
  uom: {type: String, required: true},
  unit_price: {type: Number, required: true, default: 0.00},
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

const MaterialModel = mongoose.model<iMaterial>('Material', materialSchema)
export default MaterialModel
