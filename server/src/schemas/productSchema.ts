import { object, string, TypeOf, array, number} from 'zod'

export const createProductMaterialLineSchema = object({
  materialId: number({
    required_error: 'Material is required'
  }),
  quantity: number({
    required_error: 'Quantity is required'
  })
})

export const updateProductMaterialLineSchema = object({
  id: number({
    required_error: 'Id is required'
  }),
  materialId: number({
    required_error: 'Material is required'
  }),
  quantity: number({
    required_error: 'Quantity is required'
  })
})

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    description: string(),
    productMaterialLines: array(createProductMaterialLineSchema).optional()
  })
})

export const findOneProductSchema = object({
  params: object({
    productId: string()
  })
})

export const updateProductSchema = object({
  params: object({
    productId: string()
  }),
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    description: string(),
    createData: array(createProductMaterialLineSchema).optional(),
    updateData: array(updateProductMaterialLineSchema).optional(),
    deleteId: array(object({
      id: number({
        required_error: 'Line id is required'
      })
    })).optional()
  }),
})

export type CreateProductInput = TypeOf<typeof createProductSchema>['body']
export type FindOneProductParams = TypeOf<typeof findOneProductSchema>['params']
export type UpdateProduct = TypeOf<typeof updateProductSchema>

export type CreateProductMaterialInput = TypeOf<typeof createProductMaterialLineSchema>
export type UpdateProductMaterialInput = TypeOf<typeof updateProductMaterialLineSchema>
