import { Request, Response, NextFunction } from 'express'

import { MyError } from '../middlewares/errorHandler';
import { CreateMaterialInput, FindOneMaterialParams, UpdateMaterial } from '../schemas/materialSchema';
import { createMaterialService, deleteMaterialService, findAllMaterialService, findOneMaterialService, updateMaterialService } from '../services/materialService';

export const createMaterialHandler = async (req: Request<{}, {}, CreateMaterialInput>, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const userId = res.locals.user.userId
    const material = await createMaterialService(body, userId)

    res.send({
      materialInfo: material,
      successMessage: 'Successfully create a material'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const findOneMaterialHandler = async (req: Request<FindOneMaterialParams>, res: Response, next: NextFunction) => {
  try {
    const { materialId } = req.params
    const material = await findOneMaterialService(materialId)
    
    res.send({
      materialInfo: material,
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const findMaterialsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materialArray = await findAllMaterialService()

    res.send({
      materials: materialArray
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const updateMaterialHandler = async (req: Request<UpdateMaterial['params'], {}, UpdateMaterial['body']>, res: Response, next: NextFunction) => {
  try {
    const { materialId } = req.params
    const body = req.body

    const material = await findOneMaterialService(materialId)
    const updateMaterial = await updateMaterialService(material, body)

    res.send({
      materialInfo: updateMaterial,
      successMessage: 'Successfully update material'
    })

  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}

export const deleteMaterialHandler = async (req: Request<FindOneMaterialParams>, res: Response, next: NextFunction) => {
  try {
    const { materialId } = req.params

    const material = await findOneMaterialService(materialId)
    await deleteMaterialService(material)

    res.send({
      successMessage: 'Successfully delete material'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.code))
  }
}
