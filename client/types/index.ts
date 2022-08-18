export enum QueryKeys {
  me = 'me',
}

export interface Me {
  id: number,
  email: string,
  firstname: string,
  lastname: string
}

export interface ErrorMessage {
  errorMessage: string
}

export interface SuccessMessage {
  successMessage: string
}