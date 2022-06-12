import { object, string, TypeOf} from 'zod'

export const loginSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Email is not valid'),
    password: string({
      required_error: 'password is required'
    }).min(6, 'password must be longer than 6 characters'),
  })
})

export type LoginInput = TypeOf<typeof loginSchema>['body']
