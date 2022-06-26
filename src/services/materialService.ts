import MaterialModel, { iMaterial } from '../models/MaterialModel'
import { CreateMaterialInput, UpdateMaterial } from '../schemas/materialSchema'
import { MyError } from '../middlewares/errorHandler'

export const createMaterialService = async (data: CreateMaterialInput, userId: string) => {
  const material = await MaterialModel.create({
    ...data,
    user: userId
  })

  return material.populate('user', { firstname: 1, lastname: 1, _id: 0 })
}

export const findOneMaterialService = async (materialId: string) => {
  const material = await MaterialModel.findById(materialId).populate('user', { firstname: 1, lastname: 1, _id: 0 })
  if (!material) throw new MyError('Material not found', 404)
  
  return material
}

export const findAllMaterialService = async () => {
  const materials = await MaterialModel.find().populate('user', { firstname: 1, lastname: 1, _id: 0 })
  
  return materials
}

export const updateMaterialService = async (material: iMaterial, data: UpdateMaterial['body']) => {
  material.name = data.name
  material.description = data.description
  material.unit_price = data.unit_price
  material.uom = data.uom
  await material.save()

  return material
}

export const deleteMaterialService = async (material: iMaterial) => {
  return await material.delete()
}

