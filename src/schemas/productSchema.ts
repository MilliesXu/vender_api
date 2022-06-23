import { object, string, TypeOf} from 'zod'

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    description: string()
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
  }) 
})

export type CreateProductInput = TypeOf<typeof createProductSchema>['body']
export type FindOneProductParams = TypeOf<typeof findOneProductSchema>['params']
export type UpdateProduct = TypeOf<typeof updateProductSchema>
