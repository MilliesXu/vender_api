import { getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose'
import { User } from './UserModel'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Material {
  @prop({ type: String, required: true })
    name: string
  @prop({ type: String })
    description: string
  @prop({ type: String, required: true })
    uom: string
  @prop({ type: Number, required: true, default: 0.00 })
    unit_price: number
  @prop({ ref: () => User })
    user: Ref<User>
}

const MaterialModel = getModelForClass(Material)
export default MaterialModel
