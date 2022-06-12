import 'dotenv/config'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { createServer } from '../utils/server'
import { createUserService, deleteUserService, getUserByEmailService } from '../services/userService'

const app = createServer()

const userPayload = {
  firstname: 'Erwin',
  lastname: 'Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  passwordConfirmation: 'erwinxu13'
}

const userId = new mongoose.Types.ObjectId().toString()

describe('User', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())
  })
  afterAll(async () => {
    await mongoose.disconnect()

    await mongoose.connection.close()
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
      await deleteUserService(user._id)
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
      await supertest(app).get(`/api/user/${user?._id}/${'asd-123'}`).expect(400)
    })
  })
  describe('Verified user and success', () => {
    it('Should return 200, body, and successMessage', async () => {
      const user = await getUserByEmailService(userPayload.email)
      const { body, statusCode } = await supertest(app).get(`/api/user/${user?._id}/${user?.verificationCode}`)
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
})
