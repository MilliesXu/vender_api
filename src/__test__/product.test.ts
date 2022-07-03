import 'dotenv/config'
import supertest from 'supertest'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

import { createServer } from '../utils/server'
import { signInJWT } from '../utils/jwt'

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

const materialPayload = {
  name: 'Material One',
  description: 'This is material one',
  uom: 'meter',
  unit_price: 120000
}

let token: string
let id: number
let idLine: number
let materialId: number
let prismaGlobal: PrismaClient
let lineIdToUpdate: number
let lineIdToDelete: number

describe('Product', () => {
  beforeAll(async () => {
    const prisma = new PrismaClient()
    prismaGlobal = prisma
    
    const user = await prisma.user.create({
      data: {
        firstname: userPayload.firstname,
        lastname: userPayload.lastname,
        email: userPayload.email,
        password: await argon2.hash(userPayload.password),
        verificationCode: '123',
        verified: true
      }
    })

    id = user.id

    const material = await prisma.material.create({
      data: {
        name: materialPayload.name,
        description: materialPayload.description,
        uom: materialPayload.uom,
        unit_price: materialPayload.unit_price,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    })

    token = signInJWT({ userId: user.id }, 'ACCESS_TOKEN_PRIVATE')
    materialId = material.id
  })
  afterAll(async () => {
    await prismaGlobal.productMaterialLine.deleteMany({})
    await prismaGlobal.product.deleteMany({})
    await prismaGlobal.material.deleteMany({})
    await prismaGlobal.session.deleteMany({})
    await prismaGlobal.user.deleteMany({})
    await prismaGlobal.$disconnect()
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
  describe('Create product with no material lines and success', () => {
    it('Should return 200, productData, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/product')
        .set('Cookie', `accessToken=${token}`)
        .send({
          ...productPayload,
        })
      
      id = body.productInfo.id
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          name: productPayload.name,
          description: productPayload.description,
          productMaterialLines: [],
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        },
        successMessage: 'Successfully create a product'
      })
    })
  })
  describe('Create product with material lines and success', () => {
    it('Should return 200, productData, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).post('/api/product')
        .set('Cookie', `accessToken=${token}`)
        .send({
          ...productPayload,
          productMaterialLines: [{
            materialId,
            quantity: 2.1
          }, {
            materialId,
            quantity: 1.5
          }]
        })

      idLine = body.productInfo.id
      lineIdToUpdate = body.productInfo.productMaterialLines[0].id
      lineIdToDelete = body.productInfo.productMaterialLines[1].id
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          name: productPayload.name,
          description: productPayload.description,
          productMaterialLines: [{
            quantity: 2.1,
            material: {
              id: materialId,
              name: materialPayload.name,
              description: materialPayload.description,
              uom: materialPayload.uom,
              unit_price: materialPayload.unit_price,
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            }
          }, {
            quantity: 1.5,
            material: {
              id: materialId,
              name: materialPayload.name,
              description: materialPayload.description,
              uom: materialPayload.uom,
              unit_price: materialPayload.unit_price,
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            }
          }],
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
      await supertest(app).get(`/api/product/${0}`).expect(401)
    })
  })
  describe('Get product but id not found', () => {
    it('Should return 404', async () => {
      await supertest(app).get(`/api/product/${0}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(404)
    })
  })
  describe('Get product without line and success', () => {
    it('Should return 200', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/product/${id}`)
        .set('Cookie', `accessToken=${token}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          id: id,
          name: productPayload.name,
          description: productPayload.description,
          productMaterialLines: [],
          user: {
            firstname: userPayload.firstname,
            lastname: userPayload.lastname
          }
        }
      })
    })
  })
  describe('Get product with line and success', () => {
    it('Should return 200', async () => {
      const { body, statusCode } = await supertest(app).get(`/api/product/${idLine}`)
        .set('Cookie', `accessToken=${token}`)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
          id: idLine,
          name: productPayload.name,
          description: productPayload.description,
          productMaterialLines: [{
            quantity: 2.1,
            material: {
              id: materialId,
              name: materialPayload.name,
              description: materialPayload.description,
              uom: materialPayload.uom,
              unit_price: materialPayload.unit_price,
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            }
          }, {
            quantity: 1.5,
            material: {
              id: materialId,
              name: materialPayload.name,
              description: materialPayload.description,
              uom: materialPayload.uom,
              unit_price: materialPayload.unit_price,
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            }
          }],
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
            id: id,
            name: productPayload.name,
            description: productPayload.description,
            productMaterialLines: [],
            user: {
              firstname: userPayload.firstname,
              lastname: userPayload.lastname
            }
          },{
              id: idLine,
              name: productPayload.name,
              description: productPayload.description,
              productMaterialLines: [{
                quantity: 2.1,
                material: {
                  id: materialId,
                  name: materialPayload.name,
                  description: materialPayload.description,
                  uom: materialPayload.uom,
                  unit_price: materialPayload.unit_price,
                  user: {
                    firstname: userPayload.firstname,
                    lastname: userPayload.lastname
                  }
                }
              },{
                quantity: 1.5,
                material: {
                  id: materialId,
                  name: materialPayload.name,
                  description: materialPayload.description,
                  uom: materialPayload.uom,
                  unit_price: materialPayload.unit_price,
                  user: {
                    firstname: userPayload.firstname,
                    lastname: userPayload.lastname
                  }
                }
              }],
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
      await supertest(app).put(`/api/product/${0}`)
        .expect(401)
    })
  })
  describe('Update product but no data send', () => {
    it('Should return 400', async () => {
      await supertest(app).put(`/api/product/${0}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(400)
    })
  })
  describe('Update product but product not found', () => {
    it('Should return 404', async () => {
      await supertest(app).put(`/api/product/${0}`)
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
            id: id,
            name: productUpdatePayload.name,
            description: productUpdatePayload.description,
            productMaterialLines: [],
            user: {
              firstname: userPayload.firstname,
              lastname: userPayload.lastname
            }
        },
        successMessage: 'Successfully update product'
      })
    })
  })
  describe('Update product with line and success', () => {
    it('Should return 200, productInfo, and successMessage', async () => {
      const { body, statusCode } = await supertest(app).put(`/api/product/${idLine}`)
        .set('Cookie', `accessToken=${token}`)
        .send({
          ...productUpdatePayload,
          createData: [
            {
              materialId,
              quantity: 1.8
            }, {
              materialId,
              quantity: 3.0
            }
          ],
          updateData: [
            {
              id: lineIdToUpdate,
              materialId,
              quantity: 4.0
            }
          ],
          deleteId: [
            {
              id: lineIdToDelete
            }
          ]
        })
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        productInfo: {
            id: idLine,
            name: productUpdatePayload.name,
            description: productUpdatePayload.description,
            productMaterialLines: [{
              id: lineIdToUpdate,
              quantity: 4.0,
              material: {
                id: materialId,
                name: materialPayload.name,
                description: materialPayload.description,
                uom: materialPayload.uom,
                unit_price: materialPayload.unit_price,
                user: {
                  firstname: userPayload.firstname,
                  lastname: userPayload.lastname
                }
              },
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            }, {
              quantity: 1.8,
              material: {
                id: materialId,
                name: materialPayload.name,
                description: materialPayload.description,
                uom: materialPayload.uom,
                unit_price: materialPayload.unit_price,
                user: {
                  firstname: userPayload.firstname,
                  lastname: userPayload.lastname
                }
              },
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            },{
              quantity: 3.0,
              material: {
                id: materialId,
                name: materialPayload.name,
                description: materialPayload.description,
                uom: materialPayload.uom,
                unit_price: materialPayload.unit_price,
                user: {
                  firstname: userPayload.firstname,
                  lastname: userPayload.lastname
                }
              },
              user: {
                firstname: userPayload.firstname,
                lastname: userPayload.lastname
              }
            }],
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
      await supertest(app).delete(`/api/product/${0}`)
        .expect(401)
    })
  })
  describe('Delete product but product not found', () => {
    it('Should return 404', async () => {
      await supertest(app).delete(`/api/product/${0}`)
        .set('Cookie', `accessToken=${token}`)
        .expect(404)
    })
  })
  describe('Delete product and success', () => {
    it('Should return 200, successMessage', async () => {
      const { body, statusCode } = await supertest(app).delete(`/api/product/${idLine}`)
        .set('Cookie', `accessToken=${token}`)
      
      expect(statusCode).toBe(200)
      expect(body).toMatchObject({
        successMessage: 'Successfully delete product'
      })
    })
  })
})