import axios from 'axios'
import { faker } from '@faker-js/faker'
import { Product } from '@/gateway/app/models/product'
import { Database } from '@/product/app/routes'
import { Database as OrderDatabase } from '@/order/app/routes'
import { writeFile } from 'fs/promises'

const db = new Database()
const orderDb = new OrderDatabase()
const api = axios.create({
  baseURL: 'http://localhost:3000',
})

describe('customer-routes', () => {
  beforeAll(async () => {
    await writeFile(db.dbPath, '[]')
  })

  afterAll(async () => {
    await writeFile(db.dbPath, '[]')
    await writeFile(orderDb.productDatabase, '[]')
  })

  describe('POST /product', () => {
    it('should return 200 on success', async () => {
      const product = {
        name: faker.name.fullName(),
        price: faker.commerce.price(),
      }
      const { status, data } = await api.post<Product>('/product', product)
      expect(status).toBe(200)
      expect(data.id).toBeTruthy()
      expect(data.name).toBe(product.name)
      expect(data.price).toBe(product.price)
    })
  })

  describe('GET /products', () => {
    it('should return 200 on success', async () => {
      const { status, data } = await api.get<Product[]>('/products')
      expect(status).toBe(200)
      expect(data.length).toBe(1)
      expect(data[0].id).toBeTruthy()
      expect(data[0].name).toBeTruthy()
      expect(data[0].price).toBeTruthy()
    })
  })

  describe('GET /product/:productId', () => {
    it('should return 200 on success', async () => {
      const mock = {
        name: faker.name.fullName(),
        price: faker.commerce.price(),
      }
      const {
        data: { id: productId },
      } = await api.post<Product>('/product', mock)
      const { data: product } = await api.get<Product>(`/product/${productId}`)
      expect(product.id).toBe(productId)
      expect(product.name).toBe(mock.name)
      expect(product.price).toBe(mock.price)
    })
  })
})
