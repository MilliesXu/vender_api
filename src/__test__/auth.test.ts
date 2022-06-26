import 'dotenv/config'
import supertest from 'supertest'
import mongoose from 'mongoose'

import { createServer } from '../utils/server'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { createUserService, getUserByEmailService } from '../services/userService'
import { createSessionService, findSessionByUserService } from '../services/authService'
import { signInJWT } from '../utils/jwt'

const app = createServer()

const userPayload = {
  firstname: 'Erwin',
  lastname: 'Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  passwordConfirmation: 'erwinxu13'
}
let userId: string

describe('Auth', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())

    await createUserService(userPayload)
  })
  afterAll(async () => {
    await mongoose.disconnect()

    await mongoose.connection.close()
  })
  describe('Login but not sending data', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/auth/login').expect(400)
    })
  })
  describe('Login but wrong email', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/auth/login')
      .send({
        email: 'wrongng@email.com',
        password: userPayload.password
      }) 
      .expect(401)
    })
  })
  describe('Login but not verified', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/auth/login')
      .send({
        email: userPayload.email,
        password: userPayload.password
      }) 
      .expect(403)
    })
  })
  describe('Login but wrong password', () => {
    it('Should return 400', async () => {
      const user = await getUserByEmailService(userPayload.email)
      if (user) {
        user.verified = true
        await user.save()
        userId = user._id.toString()
      }
      await supertest(app).post('/api/auth/login')
      .send({
        email: userPayload.email,
        password: 'wrongpassword'
      }) 
      .expect(401)
    })
  })
  describe('Login and success', () => {
    it('Should return 200, userInfo, successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/auth/login')
                                    .send({
                                      email: userPayload.email,
                                      password: userPayload.password
                                    }) 

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully login',
        userInfo: {
          firstname: userPayload.firstname,
          lastname: userPayload.lastname,
          verified: true
        }
      })
    })
  })
  describe('Logout but not login', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/auth/logout')
      .expect(401)
    })
  })
  describe('Logout and success', () => {
    it('Should return 200, and successMessage', async () => {
      const session = await findSessionByUserService(userId)
      const accessToken = signInJWT({ userId, session: session._id }, 'ACCESS_TOKEN_PRIVATE')
      const { body, statusCode } = await supertest(app).post('/api/auth/logout')
        .set('Cookie', `accessToken=${accessToken}`)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully logout'
      })
    })
  })
  describe('Refresh access token token but no refresh token', () => {
    it('Should return 200, and errorMessage', async () => {
      const { body, statusCode } = await supertest(app).get('/api/auth/refresh')

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        errorMessage: 'Unauthorized refresh token'
      })
    })
  })
  describe('Refresh access token token but no session', () => {
    it('Should return 200, and errorMessage', async () => {
      const sessionId = new mongoose.Types.ObjectId().toString()
      const refreshToken = signInJWT({ userId, sessionId }, 'REFRESH_TOKEN_PRIVATE')
      const { body, statusCode } = await supertest(app).get('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        errorMessage: 'Unauthorized'
      })
    })
  })
  describe('Refresh access and success', () => {
    it('Should return 200, and successMessage', async () => {
      const session = await createSessionService(userId)
      const refreshToken = signInJWT({ userId, sessionId: session._id }, 'REFRESH_TOKEN_PRIVATE')
      const { body, statusCode } = await supertest(app).get('/api/auth/refresh')
        .set('Cookie', `refreshToken=${refreshToken}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully refreshed accessToken'
      })
    })
  })
})