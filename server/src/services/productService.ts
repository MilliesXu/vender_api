import { MyError } from "../middlewares/errorHandler";
import ProductModel, { ProductDocument, ProductMaterialLineModel } from "../models/ProductModel";
import { CreateProductInput, CreateProductMaterialInput, UpdateProduct, UpdateProductMaterialInput } from '../schemas/productSchema';
import prisma from '../utils/prisma'

export const createProductService = async (data: CreateProductInput, userId: number) => {
  let product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      user: {
        connect: {
          id: userId
        }
      }
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      },
      productMaterialLines: {
        select: {
          id: true,
          material: {
            select: {
              id: true,
              name: true,
              description: true,
              uom: true,
              unit_price: true,
              user: {
                select: {
                  firstname: true,
                  lastname: true
                }
              }
            }
          },
          quantity: true,
          user: {
            select: {
              firstname: true,
              lastname: true
            }
          }
        }
      }
    }
  })

  if (data.productMaterialLines && data.productMaterialLines.length > 0) {
    for (let record of data.productMaterialLines) {
      await createProductMaterialLineService(record, product.id, userId)
    }
    product = await findOneProductService(product.id)
  }
  return product
}

export const findOneProductService = async (productId: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      },
      productMaterialLines: {
        select: {
          id: true,
          material: {
            select: {
              id: true,
              name: true,
              description: true,
              uom: true,
              unit_price: true,
              user: {
                select: {
                  firstname: true,
                  lastname: true
                }
              }
            }
          },
          quantity: true,
          user: {
            select: {
              firstname: true,
              lastname: true
            }
          }
        }
      }
    }
  })
  if (!product) throw new MyError('Product not found', 404)
  
  return product
}

export const findAllProductService = async () => {
  const products = await prisma.product.findMany({
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      },
      productMaterialLines: {
        select: {
          id: true,
          material: {
            select: {
              id: true,
              name: true,
              description: true,
              uom: true,
              unit_price: true,
              user: {
                select: {
                  firstname: true,
                  lastname: true
                }
              }
            }
          },
          quantity: true,
          user: {
            select: {
              firstname: true,
              lastname: true
            }
          }
        }
      }
    }
  })
  
  return products
}

export const updateProductService = async (productId: number, data: UpdateProduct['body'], userId: number) => {
  let product = await prisma.product.update({
    where: {
      id: productId
    },
    data: {
      name: data.name,
      description: data.description
    },
    include: {
      user: {
        select: {
          firstname: true,
          lastname: true
        }
      },
      productMaterialLines: {
        select: {
          id: true,
          material: {
            select: {
              id: true,
              name: true,
              description: true,
              uom: true,
              unit_price: true,
              user: {
                select: {
                  firstname: true,
                  lastname: true
                }
              }
            }
          },
          quantity: true,
          user: {
            select: {
              firstname: true,
              lastname: true
            }
          }
        }
      }
    }
  })

  // Check if it has data to create
  if (data.createData && data.createData.length > 0) {
    for (let record of data.createData) {
      await createProductMaterialLineService(record, product.id, userId)
    }
  }

  // Check if it has data to uodate
  if (data.updateData && data.updateData.length > 0) {
    for (let record of data.updateData) {
      await updateProductMaterialLineService(record)
    }
  }

  // Check if it has data to delete
  if (data.deleteId && data.deleteId.length > 0) {
    for (let record of data.deleteId) await deleteProductMaterialLineService(record.id)
  }

  product = await findOneProductService(product.id)

  return product
}

export const deleteProductService = async (productId: number) => {
  await deleteManyProductMaterialLineService(productId)

  return await prisma.product.delete({
    where: {
      id: productId
    }
  })
}

export const createProductMaterialLineService = async (data: CreateProductMaterialInput, productId: number, userId: number) => {
  return await prisma.productMaterialLine.create({
    data: {
      product: {
        connect: {
          id: productId,
        }
      },
      material: {
        connect: {
          id: data.materialId
        }
      },
      user: {
        connect: {
          id: userId
        }
      },
      quantity: data.quantity
    }
  })
}

export const updateProductMaterialLineService = async (data: UpdateProductMaterialInput) => {
  return await prisma.productMaterialLine.update({
    where: {
      id: data.id
    },
    data: {
      materialId: data.materialId,
      quantity: data.quantity
    }
  })
}

export const deleteProductMaterialLineService = async (id: number) => {
  return await prisma.productMaterialLine.delete({
    where: {
      id
    }
  })
}

export const deleteManyProductMaterialLineService = async (productId: number) => {
  return await prisma.productMaterialLine.deleteMany({
    where: {
      productId
    }
  })
}
