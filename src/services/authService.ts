import { MyError } from "../middlewares/errorHandler";
import prisma from '../utils/prisma'

export const createSessionService = async (userId: number) => {
  let session = await prisma.session.findFirst({
    where: {
      user: {
        id: userId
      }
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      }
    }
  })

  if (!session) session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      }
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      }
    }
  })

  return session
}

export const findSessionByIdService = async (id: number) => {
  const session = await prisma.session.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      }
    }
  })

  if (!session) throw new MyError('Unauthorized', 401)

  return session
}

export const findSessionByUserService = async (userId: number) => {
  const session = await prisma.session.findFirst({
    where: {
      user: {
        id: userId
      }
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      }
    }
  })

  if (!session) throw new MyError('Unauthorized', 401)

  return session
}

export const deleteSessionService = async (id: number) => {
  return await prisma.session.delete({
    where: {
      id
    }
  })
}
