import { CreateMaterialInput, UpdateMaterial } from '../schemas/materialSchema'
import { MyError } from '../middlewares/errorHandler'
import prisma from '../utils/prisma'

export const createMaterialService = async (data: CreateMaterialInput, userId: number) => {
  return await prisma.material.create({
    data: {
      name: data.name,
      description: data.description,
      uom: data.uom,
      unit_price: data.unit_price,
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
}

export const findOneMaterialService = async (materialId: number) => {
  const material = await prisma.material.findUnique({
    where: {
      id: materialId
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
  if (!material) throw new MyError('Material not found', 404)
  
  return material
}

export const findAllMaterialService = async () => {
  const materials = await prisma.material.findMany({
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      }
    }
  })
  
  return materials
}

export const updateMaterialService = async (materialId: number, data: UpdateMaterial['body']) => {
  return await prisma.material.update({
    where: {
      id: materialId
    },
    data: {
      name: data.name,
      description: data.description,
      uom: data.uom,
      unit_price: data.unit_price
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
}

export const deleteMaterialService = async (materialId: number) => {
  return await prisma.material.delete({
    where: {
      id: materialId
    }
  })
}

