import { Request, Response, NextFunction } from 'express'

import { MyError, catchAsync } from '../middlewares/errorHandler';
import { CreateMaterialInput, FindOneMaterialParams, UpdateMaterial } from '../schemas/materialSchema';
import { createMaterialService, deleteMaterialService, findAllMaterialService, findOneMaterialService, updateMaterialService } from '../services/materialService';

export const createMaterialHandler = catchAsync<CreateMaterialInput>(async (req, res) => {
  const body = req.body
  const userId = res.locals.user.userId
  const material = await createMaterialService(body, userId)

  res.send({
    materialInfo: material,
    successMessage: 'Successfully create a material'
  })
})

export const findOneMaterialHandler = catchAsync<{}, {}, FindOneMaterialParams>(async (req, res) => {
  const { materialId } = req.params
  const id = parseInt(materialId)

  if (id === NaN) throw new MyError('Material not found', 404)
  const material = await findOneMaterialService(id)
  
  res.send({
    materialInfo: material,
  })
})

export const findMaterialsHandler = catchAsync(async (req, res) => {
  const materialArray = await findAllMaterialService()

  res.send({
    materials: materialArray
  })
})

export const updateMaterialHandler = catchAsync<UpdateMaterial['body'], {}, UpdateMaterial['params']>(async (req, res) => {
  const { materialId } = req.params
  const id = parseInt(materialId)

  if (id === NaN) throw new MyError('Material not found', 404)
  const body = req.body

  await findOneMaterialService(id)
  const material = await updateMaterialService(id, body)

  res.send({
    materialInfo: material,
    successMessage: 'Successfully update material'
  })
})

export const deleteMaterialHandler = catchAsync<{}, {}, FindOneMaterialParams>(async (req, res) => {
  const { materialId } = req.params
  const id = parseInt(materialId)

  if (id === NaN) throw new MyError('Material not found', 404)

  await findOneMaterialService(id)
  await deleteMaterialService(id)

  res.send({
    successMessage: 'Successfully delete material'
  })
})
