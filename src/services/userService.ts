import { nanoid } from 'nanoid'
import { MyError } from '../middlewares/errorHandler'
import { CreateUserInput, UpdateUserInput } from '../schemas/userSchema'
import argon2 from 'argon2'
import prisma from '../utils/prisma'

export const createUserService = async (input: CreateUserInput) => {
  const user = await prisma.user.create({
    data: {
      firstname: input.firstname,
      lastname: input.lastname,
      email: input.email,
      password: await argon2.hash(input.password),
      verificationCode: nanoid()
    }
  })

  return user
}

export const getUsersService = async () => {
  return await prisma.user.findMany()
}

export const getUserByEmailService = async (email: string) => {
  return await prisma.user.findUnique({ 
    where: {
      email
    }
   })
}

export const getUserByEmailValidation = async (email: string) => {
  const user = await getUserByEmailService(email)

  if (!user) throw new MyError('Email is not registered as account', 400)

  return user
}

export const getUserByIdService = async (id: number) => {
  return await prisma.user.findUnique({ 
    where: {
      id
    }
   })
}

export const getUserByIdValidation = async (id: number) => {
  const user = await getUserByIdService(id)

  if (!user) throw new MyError('Not Authorized', 401)

  return user
}

export const deleteUserService = async (id: number) => {
  return await prisma.user.delete({
    where: {
      id
    }
  })
}

export const verifyUserService = async (id: number, verificationCode: string) => {
  const user = await getUserByIdService(id)
  if (!user || user.verificationCode !== verificationCode) throw new MyError('Failed to verified account', 400)

  const updateUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      verified: true
    }
  })

  return updateUser
}

export const validatePassword = async (id: number, password: string) => {
  const user = await getUserByIdService(id)
  if (!user || !user.verified) throw new MyError('User is not verifed', 403)

  const isValid = await argon2.verify(user.password, password)

  if (!isValid) throw new MyError('Invalid email or password', 401)
}

export const updateUserProfileService = async (id: number, data: UpdateUserInput) => {
  const user = prisma.user.update({
    where: {
      id
    },
    data: {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email
    }
  })

  return user
}

export const setPasswordCodeService = async (email: string) => {
  const user = await getUserByEmailService(email)
  if (!user || !user.verified) throw new MyError('Email is not registered', 403)
  const passwordResetCode = nanoid()

  const updateUser = await prisma.user.update({
    where: {
      email
    },
    data: {
      passwordResetCode
    }
  })

  return updateUser
}

export const changePasswordService = async (id: number, passwordResetCode: string, password: string) => {
  const user = await getUserByIdService(id)
  if (!user || !user.verified || user.passwordResetCode !== passwordResetCode) throw new MyError('Failed to change password', 400)

  const hashedPassword = await argon2.hash(password)

  const updateUser = await prisma.user.update({
    where: {
      id
    },
    data: {
      password: hashedPassword,
      passwordResetCode: ''
    }
  })

  return updateUser
}
