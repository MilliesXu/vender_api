import express from 'express'
import { createMaterialHandler, deleteMaterialHandler, findMaterialsHandler, findOneMaterialHandler, updateMaterialHandler } from '../controllers/materialController'

import deserializeUser from '../middlewares/deserializeUser'
import validateRequest from '../middlewares/validateRequest'
import { createMaterialSchema, findOneMaterialSchema, updateMaterialSchema } from '../schemas/materialSchema'

const materialRoute = express.Router()

materialRoute.post('/', deserializeUser, validateRequest(createMaterialSchema), createMaterialHandler)
materialRoute.get('/:materialId', deserializeUser, validateRequest(findOneMaterialSchema), findOneMaterialHandler)
materialRoute.get('/', deserializeUser, findMaterialsHandler)
materialRoute.put('/:materialId', deserializeUser, validateRequest(updateMaterialSchema), updateMaterialHandler)
materialRoute.delete('/:materialId', deserializeUser, validateRequest(findOneMaterialSchema), deleteMaterialHandler)

export default materialRoute
