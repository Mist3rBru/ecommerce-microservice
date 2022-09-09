import { Order } from '@/gateway/app/models/order'
import { Product, User } from '@/gateway/app/models'
import { Database } from '@/order/app/routes'
import { writeFile } from 'fs/promises'
import { faker } from '@faker-js/faker'
import axios from 'axios'

const db = new Database()
const api = axios.create({
  baseURL: 'http://localhost:3000',
  validateStatus: () => true,
})

describe('payment-routes', () => {
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

  describe('TOPIC order.created', () => {
    it('should return approved on success', async () => {
      const user: User = {
        id: faker.datatype.uuid(),
        name: faker.name.fullName(),
        email: faker.internet.email()
      }
      const product: Product = {
        id: faker.datatype.uuid(),
        name: faker.commerce.product(),
        price: faker.commerce.price()
      }
      const order: Partial<Order> = {
        user,
        product
      }
      await writeFile(db.userDatabase, JSON.stringify([user]))
      await writeFile(db.productDatabase, JSON.stringify([product]))

      await api.post('/order', order)
      await new Promise(r => setTimeout(r, 1000))

      const orders = await db.findOrders()
      expect(orders.length).toBe(1)
      expect(orders[0].id).toBeTruthy()
      expect(orders[0].product).toEqual(product)
      expect(orders[0].user).toEqual(user)
      expect(orders[0].status).toBe('approved')
      expect(orders[0].createdAt).toBeTruthy()
    })
  })
})
