import { DocumentType } from '@typegoose/typegoose'
import { MyError } from '../middlewares/errorHandler'
import UserModel, { User } from '../models/UserModel'
import { UpdateUserInput } from '../schemas/userSchema'

export const createUserService = async (input: Partial<User>) => {
  return await UserModel.create(input)
}

export const getUsersService = async () => {
  return await UserModel.find()
}

export const getUserByEmailService = async (email: string) => {
  return await UserModel.findOne({ email })
}

export const getUserByIdService = async (id: string) => {
  return await UserModel.findById(id)
}

export const deleteUserService = async (id: string) => {
  return await UserModel.deleteOne({ id })
}

export const verifyUserService = async (user: DocumentType<User>, verificationCode: string) => {
  if (user.verificationCode !== verificationCode) throw new MyError('Failed to verified account', 400)

  user.verified = true
  await user.save()
  return user
}

export const validatePassword = async (user: DocumentType<User>, password: string) => {
  if (!user.verified) throw new MyError('User is not verified', 403)

  const isValid = await user.validatePassword(password)

  if (!isValid) throw new MyError('Invalid email or password', 401)
}

export const updateUserProfileService = async (user: DocumentType<User>, updateData: UpdateUserInput) => {
  user.firstname = updateData.firstname
  user.lastname = updateData.lastname
  user.email = updateData.email

  await user.save()

  return user
}
