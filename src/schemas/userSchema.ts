
import { number, object, string, TypeOf, ZodIssueCode } from 'zod'

import { getUserByEmailService } from '../services/userService'

export const createUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Email is not valid'),
    firstname: string({
      required_error: 'firstname is required'
    }),
    lastname: string({
      required_error: 'lastname is required'
    }),
    password: string({
      required_error: 'password is required'
    }).min(6, 'password must be longer than 6 characters'),
    passwordConfirmation: string({
      required_error: 'passwordConfirmation is required'
    })
  }).superRefine(async (data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Password not matched'
      })
    }

    const user = await getUserByEmailService(data.email)
    
    if (user !== null) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Email has been used'
      })
    }
  })
})

export const verificationUserSchema = object({
  params: object({
    userId: string(),
    verificationCode: string()
  })
})

export const updateUserSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Email is not valid'),
    firstname: string({
      required_error: 'firstname is required'
    }),
    lastname: string({
      required_error: 'lastname is required'
    })
  })
})

export const requestChangePasswordSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required'
    }).email('Email is not valid')
  })
})

export const changePasswordSchema = object({
  params: object({
    userId: string(),
    passwordResetCode: string()
  }),
  body: object({
    password: string({
      required_error: 'password is required'
    }).min(6, 'password must be longer than 6 characters'),
    passwordConfirmation: string({
      required_error: 'passwordConfirmation is required'
    })
  }).superRefine(async (data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: ZodIssueCode.custom,
        message: 'Password not matched'
      })
    }
  })
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']
export type VerificationUserParams = TypeOf<typeof verificationUserSchema>['params']
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body']
export type RequestChangePassword = TypeOf<typeof requestChangePasswordSchema>['body']
export type ChangePasswordInput = TypeOf<typeof changePasswordSchema>
