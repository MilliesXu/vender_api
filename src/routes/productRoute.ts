import express from 'express'
import { createProductHandler } from '../controllers/productController'
import deserializeUser from '../middlewares/deserializeUser'
import validateRequest from '../middlewares/validateRequest'
import { createProductSchema } from '../schemas/productSchema'

const productRoute = express.Router()

productRoute.post('/', deserializeUser, validateRequest(createProductSchema), createProductHandler)

export default productRoute
