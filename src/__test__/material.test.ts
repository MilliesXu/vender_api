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

const materialPayload = {
  name: 'Material One',
  description: 'This is material one',
  uom: 'meter',
  unit_price: 120000
}

const materialUpdatePayload = {
  name: 'Material One Update',
  description: 'This is material one updated',
  uom: 'cm',
  unit_price: 12000
}

let token: string
const materialId = new mongoose.Types.ObjectId().toString()
let id: string

describe('Material', () => {
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
  describe('Create material but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).post('/api/material').expect(401)
    })
  })
  describe('Create material but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).post('/api/material')
        .set('Cookie', `accessToken=${token}`)
        .expect(400)
    })
  })
  describe('Create material and success', () => {
    it('Should return 200, materialData, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/material')
        .set('Cookie', `accessToken=${token}`)
        .send(materialPayload)

      id = body.materialInfo._id
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        materialInfo: {
          name: materialPayload.name,
          description: materialPayload.description,
          uom: materialPayload.uom,
          unit_price: materialPayload.unit_price,
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        },
        successMessage: 'Successfully create a material'
      })
    })
  })
  describe('Get material but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).get(`/api/material/${materialId}`).expect(401)
    })
  })
  describe('Get material but id not found', () => {
    it('Should return 404', async () => {
      await supertest(app).get(`/api/material/${materialId}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(404)
    })
  })
  describe('Get material and success', () => {
    it('Should return 200', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/material/${id}`)
        .set('Cookie', `accessToken=${token}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        materialInfo: {
          _id: id,
          name: materialPayload.name,
          description: materialPayload.description,
          uom: materialPayload.uom,
          unit_price: materialPayload.unit_price,
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        }
      })
    })
  })
  describe('Get all materials but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).get(`/api/material/`)
        .expect(401)
    })
  })
  describe('Get all materials and success', () => {
    it('Should return 200', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/material/`)
        .set('Cookie', `accessToken=${token}`)
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        materials: 
          [{
              _id: id,
              name: materialPayload.name,
              description: materialPayload.description,
              uom: materialPayload.uom,
              unit_price: materialPayload.unit_price,
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
          }]
      })
    })
  })
  describe('Update material but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).put(`/api/material/${materialId}`)
        .expect(401)
    })
  })
  describe('Update material but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).put(`/api/material/${materialId}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(400)
    })
  })
  describe('Update material but material not found', () => {
    it('Should return 404', async () => {
      await supertest(app).put(`/api/product/${materialId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(materialUpdatePayload)
        .expect(404)
    })
  })
  describe('Update material and success', () => {
    it('Should return 200, materialInfo, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).put(`/api/material/${id}`)
        .set('Cookie', `accessToken=${token}`)
        .send(materialUpdatePayload)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        materialInfo: {
            _id: id,
            name: materialUpdatePayload.name,
            description: materialUpdatePayload.description,
            uom: materialUpdatePayload.uom,
            unit_price: materialUpdatePayload.unit_price,
            user: {
              firstname: userPayload.firstname,
              lastname: userPayload.lastname
            }
        },
        successMessage: 'Successfully update material'
      })
    })
  })
  describe('Delete material but not login', () => {
    it('Should return 401', async () => {
      await supertest(app).delete(`/api/product/${materialId}`)
        .expect(401)
    })
  })
  describe('Delete material but product not found', () => {
    it('Should return 404', async () => {
      await supertest(app).delete(`/api/product/${materialId}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(404)
    })
  })
  describe('Delete material and success', () => {
    it('Should return 200, successMessage', async () => {
      const { body, statusCode } = await supertest(app).delete(`/api/material/${id}`)
        .set('Cookie', `accessToken=${token}`)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully delete material'
      })
    })
  })
  describe('Get all material and success', () => {
    it('Should return 200, and empty array', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/material/`)
        .set('Cookie', `accessToken=${token}`)
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        materials: []
      })
    })
  })
})
