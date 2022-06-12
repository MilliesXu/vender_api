import { MyError } from "../middlewares/errorHandler";
import SessionModel from "../models/SessionModel";

export const createSessionService = async (userId: string) => {
  let session = await SessionModel.findOne({ user: userId, valid: true })

  if (!session) session = await SessionModel.create({ user: userId })

  return session
}

export const findSessionByIdService = async (id: string) => {
  const session = await SessionModel.findById(id)

  if (!session) throw new MyError('Unauthorized', 401)

  return session
}

export const findSessionByUserService = async (userId: string) => {
  const session = await SessionModel.findOne({ user: userId })

  if (!session) throw new MyError('Unauthorized', 401)

  return session
}

export const deleteSessionService = async (id: string) => {
  return await SessionModel.findByIdAndDelete(id)
}
