import 'dotenv/config'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

import { createServer } from '../utils/server'
import { signInJWT } from '../utils/jwt'
import { createUserService } from '../services/userService'

const app = createServer()

const userPayload = {
  firstname: 'Erwin',
  lastname: 'Xu',
  email: 'winzchip@gmail.com',
  password: 'erwinxu13',
  passwordConfirmation: 'erwinxu13'
}

const productPayload = {
  name: 'Product One',
  description: 'This is product one'
}

let token: string

describe('Product', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create()

    await mongoose.connect(mongoServer.getUri())

    const user = await createUserService(userPayload)
    user.verified = true
    await user.save()

    token = signInJWT({ userId: user._id }, 'ACCESS_TOKEN_PRIVATE')
  })
  afterAll(async () => {
    await mongoose.disconnect()

    await mongoose.connection.close()
  })
  describe('Create product but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).post('/api/product').expect(401)
    })
  })
  describe('Create product but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/product')
        .set('Cookie', `accessToken=${token}`)
        .expect(400)
    })
  })
  describe('Create product and success', () => {
    it('Should return 200, productData, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/product')
        .set('Cookie', `accessToken=${token}`)
        .send(productPayload)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          name: productPayload.name,
          description: productPayload.description,
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        },
        successMessage: 'Successfully create a product'
      })
    })
  })
})