import { MyError, catchAsync } from '../middlewares/errorHandler';

import { changePasswordService, createUserService, getUserByIdService, getUsersService, setPasswordCodeService, updateUserProfileService, verifyUserService } from '../services/userService';
import { ChangePasswordInput, CreateUserInput, RequestChangePassword, UpdateUserInput, VerificationUserParams } from '../schemas/userSchema';
import sendMail from '../utils/mailer';

export const getUserHandler = catchAsync(async (req, res ) => {
    const users = await getUsersService()
    res.send(users)
})

export const getUserProfileHandler = catchAsync(async (req, res) => {
  const userId: number = res.locals.user.userId

  const user = await getUserByIdService(userId)
  if (!user) throw new MyError('Not authorized', 401)
  if (!user.verified) throw new MyError('User is not verified', 403)

  res.send({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email
  })
})

export const createUserHandler = catchAsync<CreateUserInput>(async (req, res) => {
  const body = req.body
  const user = await createUserService(body)
  await sendMail({
    from: 'test@gmail.com',
    to: user.email,
    subject: 'Verified your email',
    text: `Id = ${user.id}, verification code = ${user.verificationCode}`
  })

  res.send({
    successMessage: 'A verification email has been sent'
  })
})

export const verificationUserHandler = catchAsync<{}, {}, VerificationUserParams>(async (req, res) => {
  const { userId, verificationCode } = req.params
  const id = parseInt(userId)

  if (id === NaN) throw new MyError('Failed to verified account', 400)

  const verifieduser = await verifyUserService(id, verificationCode)
  res.statusMessage = 'Successfully verified your account'
  res.send({
    userInfo: {
      firstname: verifieduser.firstname,
      lastname: verifieduser.lastname,
      verified: verifieduser.verified,
    },
    successMessage: 'Successfully verified your account'
  })
})

export const updateUserProfileHandler = catchAsync<UpdateUserInput>(async (req, res) => {
  const body = req.body
  const userId: number = res.locals.user.userId
  const user = await updateUserProfileService(userId, body)

  res.send({
    userInfo: {
      firstname: user?.firstname,
      lastname: user?.lastname,
      verified: user?.verified
    },
    successMessage: 'Successfully update user profile'
  })
})

export const requestChangePasswordHandler = catchAsync<RequestChangePassword>(async (req, res) => {
  const { email } = req.body
  const user = await setPasswordCodeService(email)

  await sendMail({
    from: 'test@gmail.com',
    to: user.email,
    subject: 'Verified your email',
    text: `Id = ${user.id}, reset password code = ${user.passwordResetCode}`
  })

  res.send({
    successMessage: 'A verification email has been sent'
  })
})

export const changePasswordHandler = catchAsync<ChangePasswordInput['body'], {}, ChangePasswordInput['params']>(async (req, res) => {
  const { userId, passwordResetCode } = req.params
  const { password } = req.body
  await changePasswordService(parseInt(userId), passwordResetCode, password)

  res.send({
    successMessage: 'Your password has been changed'
  })
})
