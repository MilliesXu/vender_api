import { getModelForClass, prop, Ref, modelOptions } from '@typegoose/typegoose'
import { User } from './UserModel'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Product {
  @prop({ type: String, required: true })
    name: string
  @prop({ type: String })
    description: string
  @prop({ ref: () => User })
    user: Ref<User>
}

const ProductModel = getModelForClass(Product)
export default ProductModel
