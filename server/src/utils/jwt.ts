import jwt from 'jsonwebtoken'

export const signInJWT = (object: Object, keyName: 'ACCESS_TOKEN_PRIVATE' | 'REFRESH_TOKEN_PRIVATE', options?: jwt.SignOptions | undefined) => {
  const signkey = process.env[keyName] as string
  const expiresIn = keyName === 'ACCESS_TOKEN_PRIVATE' ? process.env.ACCESS_TOKEN_EXPR as string : process.env.REFRESH_TOKEN_EXPR as string
  
  return jwt.sign(object, signkey, {
    ...(options && options),
    expiresIn,
    algorithm: 'RS256'
  })
}

export const verifyJWT = <T>(token: string, keyName: 'ACCESS_TOKEN_PUBLIC' | 'REFRESH_TOKEN_PUBLIC'): T | null => {
  const publicKey = process.env[keyName] as string
  
  try {
    const decoded = jwt.verify(token, publicKey) as T
    
    return decoded
  } catch (error: any) {
    return null
  }
}
