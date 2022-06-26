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

const productUpdatePayload = {
  name: 'Product Update One',
  description: 'This is a update product one'
}

let token: string
const productId = new mongoose.Types.ObjectId().toString()
let id: string

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

      id = body.productInfo._id
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          name: productPayload.name,
          description: productPayload.description,
          lines: [],
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        },
        successMessage: 'Successfully create a product'
      })
    })
  })
  describe('Get product but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).get(`/api/product/${productId}`).expect(401)
    })
  })
  describe('Get product but id not found', () => {
    it('Should return 404', async () => {
      await supertest(app).get(`/api/product/${productId}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(404)
    })
  })
  describe('Get product and success', () => {
    it('Should return 200', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/product/${id}`)
        .set('Cookie', `accessToken=${token}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          _id: id,
          name: productPayload.name,
          description: productPayload.description,
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        }
      })
    })
  })
  describe('Get products but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).get(`/api/product/`)
        .expect(401)
    })
  })
  describe('Get all product and success', () => {
    it('Should return 200', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/product/`)
        .set('Cookie', `accessToken=${token}`)
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        products: 
          [{
              _id: id,
              name: productPayload.name,
              description: productPayload.description,
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
          }]
      })
    })
  })
  describe('Update product but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).put(`/api/product/${productId}`)
        .expect(401)
    })
  })
  describe('Update product but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).put(`/api/product/${productId}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(400)
    })
  })
  describe('Update product but product not found', () => {
    it('Should return 404', async () => {
      await supertest(app).put(`/api/product/${productId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(productUpdatePayload)
        .expect(404)
    })
  })
  describe('Update product and success', () => {
    it('Should return 200, productInfo, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).put(`/api/product/${id}`)
        .set('Cookie', `accessToken=${token}`)
        .send(productUpdatePayload)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
            _id: id,
            name: productUpdatePayload.name,
            description: productUpdatePayload.description,
            user: {
              firstname: userPayload.firstname,
              lastname: userPayload.lastname
            }
        },
        successMessage: 'Successfully update product'
      })
    })
  })
  describe('Delete product but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).delete(`/api/product/${productId}`)
        .expect(401)
    })
  })
  describe('Delete product but product not found', () => {
    it('Should return 404', async () => {
      await supertest(app).delete(`/api/product/${productId}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(404)
    })
  })
  describe('Delete product and success', () => {
    it('Should return 200, successMessage', async () => {
      const { body, statusCode } = await supertest(app).delete(`/api/product/${id}`)
        .set('Cookie', `accessToken=${token}`)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully delete product'
      })
    })
  })
  describe('Get all product and success', () => {
    it('Should return 200, and empty array', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/product/`)
        .set('Cookie', `accessToken=${token}`)
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        products: []
      })
    })
  })
})