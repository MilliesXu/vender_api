import express from 'express'
import { createProductHandler, deleteProductHandler, findOneProductHandler, findProductsHandler, updateProductHandler } from '../controllers/productController'
import deserializeUser from '../middlewares/deserializeUser'
import validateRequest from '../middlewares/validateRequest'
import { createProductSchema, findOneProductSchema, updateProductSchema } from '../schemas/productSchema'

const productRoute = express.Router()

productRoute.post('/', deserializeUser, validateRequest(createProductSchema), createProductHandler)
productRoute.get('/:productId', deserializeUser, validateRequest(findOneProductSchema), findOneProductHandler)
productRoute.get('/', deserializeUser, findProductsHandler)
productRoute.put('/:productId', deserializeUser, validateRequest(updateProductSchema), updateProductHandler)
productRoute.delete('/:productId', deserializeUser, validateRequest(findOneProductSchema), deleteProductHandler)

export default productRoute
