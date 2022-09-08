import axios from 'axios'
import { faker } from '@faker-js/faker'
import { Order } from '@/gateway/app/models/order'
import { Database } from '@/order/app/routes'
import { readFile, writeFile } from 'fs/promises'
import { Product, User } from '@/gateway/app/models'

const db = new Database()
const api = axios.create({
  baseURL: 'http://localhost:3000',
  validateStatus: () => true,
})

describe('order-routes', () => {
  beforeAll(async () => {
    await writeFile(db.userDatabase, '[]')
    await writeFile(db.productDatabase, '[]')
    await writeFile(db.orderDatabase, '[]')
  })

  afterAll(async () => {
    await writeFile(db.userDatabase, '[]')
    await writeFile(db.productDatabase, '[]')
    await writeFile(db.orderDatabase, '[]')
  })

  describe('POST /order', () => {
    it('should return 400 if invalid params are provided', async () => {
      const order: Partial<Order> = {
        user: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
          email: faker.internet.email(),
        },
        product: {
          id: faker.datatype.uuid(),
        },
      }

      let res = await api.post<{ error: string }>('/order', order)
      expect(res.status).toBe(400)
      expect(res.data).toEqual({ error: 'user or product does not exist' })

      await writeFile(db.userDatabase, JSON.stringify([order.user]))
      res = await api.post<{ error: string }>('/order', order)
      expect(res.status).toBe(400)
      expect(res.data).toEqual({ error: 'user or product does not exist' })

      await writeFile(db.userDatabase, '[]')
      await writeFile(db.productDatabase, JSON.stringify([order.product]))
      res = await api.post<{ error: string }>('/order', order)
      expect(res.status).toBe(400)
      expect(res.data).toEqual({ error: 'user or product does not exist' })
    })

    it('should return 200 on success', async () => {
      const order: Partial<Order> = {
        user: {
          id: faker.datatype.uuid(),
          name: faker.name.fullName(),
          email: faker.internet.email(),
        },
        product: {
          id: faker.datatype.uuid(),
        },
      }
      await writeFile(db.userDatabase, JSON.stringify([order.user]))
      await writeFile(db.productDatabase, JSON.stringify([order.product]))

      const { status, data } = await api.post<Order>('/order', order)

      expect(status).toBe(200)
      expect(data).toBeTruthy()
      expect(data.id).toBeTruthy()
      expect(data.createdAt).toBeTruthy()
      expect(data.product).toEqual(order.product)
      expect(data.user).toEqual(order.user)
    })
  })

  describe('TOPIC user.created', () => {
    it('should save use on database', async () => {
      const mock: Partial<User> = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      }
      const { data, status } = await api.post<User>('/user', mock)
      await new Promise(r => setTimeout(r, 1000))

      const database = await readFile(db.userDatabase)
      const users: User[] = JSON.parse(database.toString())
      const isSaved = users.find(user => user.id === data.id)
      expect(status).toBe(200)
      expect(isSaved).toBeTruthy()
    })
  })

  describe('TOPIC product.created', () => {
    it('should save use on database', async () => {
      const mock: Partial<Product> = {
        name: faker.commerce.product(),
        price: faker.commerce.price()
      }
      const { data, status } = await api.post<User>('/product', mock)
      await new Promise(r => setTimeout(r, 1000))

      const database = await readFile(db.productDatabase)
      const products: User[] = JSON.parse(database.toString())
      const isSaved = products.find(product => product.id === data.id)
      expect(status).toBe(200)
      expect(isSaved).toBeTruthy()
    })
  })
})
