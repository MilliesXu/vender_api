import { object, string, TypeOf, array, number} from 'zod'

export const createProductMaterialLineSchema = object({
  materialId: string({
    required_error: 'Material is required'
  }),
  quantity: number({
    required_error: 'Quantity is required'
  })
})

export const updateProductMaterialLineSchema = object({
  _id: string({
    required_error: 'Id is required'
  }),
  materialId: string({
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
    lines: array(createProductMaterialLineSchema).optional()
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
    description: string()
  }),
  deleteId: array(object({
    _id: string({
      required_error: 'Line id is required'
    })
  })).optional(),
  lines: array(updateProductMaterialLineSchema).optional()
})

export type CreateProductInput = TypeOf<typeof createProductSchema>['body']
export type FindOneProductParams = TypeOf<typeof findOneProductSchema>['params']
export type UpdateProduct = TypeOf<typeof updateProductSchema>

export type CreateProductMaterialInput = TypeOf<typeof createProductMaterialLineSchema>
