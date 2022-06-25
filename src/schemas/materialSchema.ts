import { object, string, TypeOf, number} from 'zod'

export const createMaterialSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    description: string(),
    uom: string({
      required_error: 'Uom is required'
    }),
    unit_price: number({
      required_error: 'Unit price is required'
    }).nonnegative('Unit price cannot be negative'),
  })
})

export const findOneMaterialSchema = object({
  params: object({
    materialId: string()
  })
})

export const updateMaterialSchema = object({
  params: object({
    materialId: string()
  }),
  body: object({
    name: string({
      required_error: 'Name is required'
    }),
    description: string(),
    uom: string({
      required_error: 'Uom is required'
    }),
    unit_price: number({
      required_error: 'Unit price is required'
    }).nonnegative('Unit price cannot be negative'),
  }) 
})

export type CreateMaterialInput = TypeOf<typeof createMaterialSchema>['body']
export type FindOneMaterialParams = TypeOf<typeof findOneMaterialSchema>['params']
export type UpdateMaterial = TypeOf<typeof updateMaterialSchema>
