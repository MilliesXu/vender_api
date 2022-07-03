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
    next(new MyError(error.message, error.errorCode))
  }
}

export const findOneMaterialHandler = async (req: Request<FindOneMaterialParams>, res: Response, next: NextFunction) => {
  try {
    const { materialId } = req.params
    const id = parseInt(materialId)

    if (id === NaN) throw new MyError('Material not found', 404)
    const material = await findOneMaterialService(id)
    
    res.send({
      materialInfo: material,
    })
  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}

export const findMaterialsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const materialArray = await findAllMaterialService()

    res.send({
      materials: materialArray
    })
  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}

export const updateMaterialHandler = async (req: Request<UpdateMaterial['params'], {}, UpdateMaterial['body']>, res: Response, next: NextFunction) => {
  try {
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

  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}

export const deleteMaterialHandler = async (req: Request<FindOneMaterialParams>, res: Response, next: NextFunction) => {
  try {
    const { materialId } = req.params
    const id = parseInt(materialId)

    if (id === NaN) throw new MyError('Material not found', 404)

    await findOneMaterialService(id)
    await deleteMaterialService(id)

    res.send({
      successMessage: 'Successfully delete material'
    })
  } catch (error: any) {
    next(new MyError(error.message, error.errorCode))
  }
}
