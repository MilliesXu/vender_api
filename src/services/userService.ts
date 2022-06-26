import { nanoid } from 'nanoid'
import { MyError } from '../middlewares/errorHandler'
import UserModel, { iUserMethods, UserDocument, iUser } from '../models/UserModel'
import { UpdateUserInput } from '../schemas/userSchema'
import argon2 from 'argon2'

export const createUserService = async (input: Partial<iUser>) => {
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

export const verifyUserService = async (user: UserDocument, verificationCode: string) => {
  if (user.verificationCode !== verificationCode) throw new MyError('Failed to verified account', 400)

  user.verified = true
  await user.save()
  return user
}

export const validatePassword = async (user: iUserMethods, password: string) => {
  if (!user.verified) throw new MyError('User is not verified', 403)

  const isValid = await user.validatePassword(user, password)

  if (!isValid) throw new MyError('Invalid email or password', 401)
}

export const updateUserProfileService = async (user: UserDocument, updateData: UpdateUserInput) => {
  user.firstname = updateData.firstname
  user.lastname = updateData.lastname
  user.email = updateData.email

  await user.save()

  return user
}

export const setPasswordCodeService = async (user: UserDocument, clearResetPasswordCode = false) => {
  clearResetPasswordCode ? user.passwordResetCode = nanoid() : user.passwordResetCode = ''

  await user.save()
  return user
}

export const changePasswordService = async (user: UserDocument, passwordResetCode: string, password: string) => {
  if (!user.verified) throw new MyError('Email is not registered as account', 400)
  if (user.passwordResetCode !== passwordResetCode) throw new MyError('Email is not registered as account', 400)
  const hashedPassword = await argon2.hash(password)
  user.password = hashedPassword
  user.passwordResetCode = null
  await user.save()
}
