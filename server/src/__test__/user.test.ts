import 'dotenv/config'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { PrismaClient } from '@prisma/client'

import { createServer } from '../utils/server'
import { createUserService, deleteUserService, getUserByEmailService } from '../services/userService'
import { signInJWT } from '../utils/jwt'
import { createSessionService } from '../services/authService'

const app = createServer()

const userPayload = {
  firstname: 'Erwin',
  lastname: 'Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  passwordConfirmation: 'erwinxu13',
  passwordResetCode: '',
  userId: 0
}

const userId = new mongoose.Types.ObjectId().toString()
let id: number
let idNotVerified: number
let accessTokenGlobal: string
let prismaGlobal: PrismaClient

describe('User', () => {
  beforeAll(async () => {
    const prisma = new PrismaClient()
    prismaGlobal = prisma
  })
  afterAll(async () => {
    await prismaGlobal.session.deleteMany({})
    await prismaGlobal.user.deleteMany({})
    await prismaGlobal.$disconnect()
  })
  describe('Create User but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/').expect(400)
    })
  })
  describe('Create User but not full data submitted', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/')
        .send({
          firstname: 'Erwin',
          lastname: 'Xu'
        })
        .expect(400)
    })
  })
  describe('Create user but password is not confirmed', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/')
        .send({
          firstname: 'Erwin',
          lastname: 'Xu',
          email: 'winzchip@gmail.com',
          password: 'erwiinxu13',
          passwordConfirmation: 'erwinxu13'
        })
        .expect(400)
    })
  })
  describe('Create user but email is already used', () => {
    it('Should return 400', async () => {
      const user = await createUserService(userPayload)
      await supertest(app).post('/api/user/')
        .send(userPayload)
        .expect(400)
      await deleteUserService(user.id)
    })
  })
  describe('Create user and success', () => {
    it('Should return 200, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/user/')
                                    .send(userPayload)
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'A verification email has been sent'
      })
    })
  })
  describe('Verified user but wrong user id', () => {
    it('Should return 400', async () => {
      await supertest(app).get(`/api/user/${userId}/${'asd-123'}`).expect(400)
    })
  })
  describe('Verified user but wrong verification code', () => {
    it('Should return 400', async () => {
      const user = await getUserByEmailService(userPayload.email)
      await supertest(app).get(`/api/user/${user?.id}/${'asd-123'}`).expect(400)
    })
  })
  describe('Verified user and success', () => {
    it('Should return 200, body, and successMessage', async () => {
      const user = await getUserByEmailService(userPayload.email)
      if (user) id = user.id
      const { body, statusCode } = await supertest(app).get(`/api/user/${user?.id}/${user?.verificationCode}`)
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully verified your account',
        userInfo: {
          firstname: user?.firstname,
          lastname: user?.lastname,
          verified: true
        }
      })
    })
  })
  describe('Get user profile but not logged in', () => {
    it('Should return 401', async () => {
      await supertest(app).get('/api/user/').expect(401)
    })
  })
  describe('Get user profile and success', () => {
    it('Should return 200, and user profile', async () => {
      const session = await createSessionService(id)
      const accessToken = signInJWT({ userId: id, sessionId: session.id }, 'ACCESS_TOKEN_PRIVATE')
      accessTokenGlobal = accessToken

      const { body, statusCode } = await supertest(app).get('/api/user/')
        .set('Cookie', `accessToken=${accessToken}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        firstname: userPayload.firstname,
        lastname: userPayload.lastname,
        email: userPayload.email
      })
    })
  })
  describe('Update user profile but not logged in', () => {
    it('Should return 401', async () => {
      await supertest(app).put('/api/user/').expect(401)
    })
  })
  describe('Update user profile but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).put('/api/user/')
        .set('Cookie', `accessToken=${accessTokenGlobal}`)
        .expect(400)
    })
  })
  describe('Update user profile but email is already used', () => {
    it('Should be return 400', async () => {
      const user = await createUserService({
        firstname: userPayload.firstname,
        lastname: userPayload.lastname,
        email: 'testemail@email.com',
        password: userPayload.password,
        passwordConfirmation: userPayload.passwordConfirmation
      })
      idNotVerified = user.id
      await supertest(app).put('/api/user/')
        .set('Cookie', `accessToken=${accessTokenGlobal}`)
        .send({
          firstname: 'James',
          lastname: 'Smith',
          email: user.email
        })
        .expect(400)
    })
  })
  describe('Update user profile but user not verified', () => {
    it('Should be return 400', async () => {
      const accessToken = signInJWT({ userId: idNotVerified }, 'ACCESS_TOKEN_PRIVATE')
      await supertest(app).put('/api/user/')
        .set('Cookie', `accessToken=${accessToken}`)
        .send({
          firstname: 'James',
          lastname: 'Smith',
          email: 'another@email.com'
        })
        .expect(403)
    })
  })
  describe('Update user profile and success', () => {
    it('Should be return 200, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).put('/api/user/')
        .set('Cookie', `accessToken=${accessTokenGlobal}`)
        .send({
          firstname: 'James',
          lastname: 'Smith',
          email: userPayload.email
        })

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully update user profile',
        userInfo: {
          firstname: 'James',
          lastname: 'Smith',
          verified: true
        }
      })
    })
  })
  describe('Request change password, but not send data', () => {
    it('Should return 400', async () => {
      await supertest(app).get('/api/user/requestResetPassword')
        .expect(400)
    })
  })
  describe('Request change password but email not exist', () => {
    it('Should return 400', async () => {
      await supertest(app).get('/api/user/requestResetPassword')
        .send({
          email: 'noonseuse@gmail.com'
        })
        .expect(400)
    })
  })
  describe('Request change password but user not verified', () => {
    it('Should return 400', async () => {
      await supertest(app).get('/api/user/requestResetPassword')
        .send({
          email: 'testemail3@email.com'
        })
        .expect(400)
    })
  })
  describe('Request change password and success', () => {
    it('Should return 200m and successMessage', async () => {
      const { body, statusCode } = await supertest(app).get('/api/user/requestResetPassword')
        .send({
          email: 'winzchip@gmail.com'
        })
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'A verification email has been sent'
      })
    })
  })
  describe('Change password but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/resetPassword/1234567/askdljiow231')
        .expect(400)
    })
  })
  describe('Change password but password not match', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/user/resetPassword/1234567/askdljiow231')
        .send({
          password: 'erwinxu13',
          passwordConfirmation: 'erwinxu'
        })
        .expect(400)
    })
  })
  describe('Change password but user id not exist', () => {
    it('Should return 400', async () => {
      await supertest(app).post(`/api/user/resetPassword/${userId}/askdljiow231`)
        .send({
          password: 'erwinxu13',
          passwordConfirmation: 'erwinxu13'
        })
        .expect(400)
    })
  })
  describe('Change password but password reset code is wrong', () => {
    it('Should return 400', async () => {
      const user = await getUserByEmailService(userPayload.email)
      if (user) userPayload.userId = user.id

      if (user?.passwordResetCode) {
        userPayload.passwordResetCode = user.passwordResetCode
      }
      await supertest(app).post(`/api/user/resetPassword/${userPayload.userId}/askdljiow231`)
        .send({
          password: 'erwinxu13',
          passwordConfirmation: 'erwinxu13'
        })
        .expect(400)
    })
  })
  describe('Change password and success', () => {
    it('Should return 200 and successMessage', async () => {
      const user = await getUserByEmailService(userPayload.email)

      if (user) userPayload.userId = user?.id

      if (user?.passwordResetCode) {
        userPayload.passwordResetCode = user.passwordResetCode
      }
      const {body, statusCode} = await supertest(app).post(`/api/user/resetPassword/${userPayload.userId}/${userPayload.passwordResetCode}`)
        .send({
          password: 'erwinxu13',
          passwordConfirmation: 'erwinxu13'
        })

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Your password has been changed'
      })
    })
  })
})