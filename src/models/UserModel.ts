import  mongoose, { Schema, Document, Model } from 'mongoose'
import { nanoid } from 'nanoid'
import argon2 from 'argon2'

export interface iUser{
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  verificationCode: string,
  passwordResetCode: string | null,
  verified: boolean
}

export interface iUserMethods extends iUser {
  validatePassword(user: iUser, candidatePassword: string): Promise<boolean>
}

type UserType = Model<iUser, {}, iUserMethods>
export type UserDocument = iUserMethods & Document

const userSchema = new Schema<iUser, UserType, iUserMethods>({
  email: {type: String, lowercase: true, required: true, unique: true},
  firstname: {type: String, required: true},
  lastname: {type: String, required: true},
  password: {type: String, required: true},
  verificationCode: {type: String, required: true, default: () => nanoid()},
  passwordResetCode: {type: String || null},
  verified: {type: Boolean, default: false}
}, {
  timestamps: true,
})

userSchema.methods.validatePassword = async (user: iUser, candidatePassword: string) => {
  try {
    return argon2.verify(user.password, candidatePassword)
  } catch (Error: any) {
    return false
  }
}

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return

  const hashedPassword = await argon2.hash(this.password)

  this.password = hashedPassword
})


const UserModel = mongoose.model<iUser, UserType>('User', userSchema)

export default UserModel
