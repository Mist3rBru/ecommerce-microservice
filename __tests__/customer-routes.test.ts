import axios from 'axios'
import { faker } from '@faker-js/faker'
import { User } from '@/gateway/app/models/user'
import { Database } from '@/customer/app/routes'
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
    await writeFile(orderDb.userDatabase, '[]')
  })

  describe('POST /user', () => {
    it('should return 200 on success', async () => {
      const user = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      }
      const { status, data } = await api.post<User>('/user', user)
      expect(status).toBe(200)
      expect(data.id).toBeTruthy()
      expect(data.name).toBe(user.name)
      expect(data.email).toBe(user.email)
    })
  })

  describe('GET /users', () => {
    it('should return 200 on success', async () => {
      const { status, data } = await api.get<User[]>('/users')
      expect(status).toBe(200)
      expect(data.length).toBe(1)
      expect(data[0].id).toBeTruthy()
      expect(data[0].name).toBeTruthy()
      expect(data[0].email).toBeTruthy()
    })
  })

  describe('GET /user/:userId', () => {
    it('should return 200 on success', async () => {
      const mock = {
        name: faker.name.fullName(),
        email: faker.internet.email(),
      }
      const {
        data: { id: userId },
      } = await api.post<User>('/user', mock)
      const { data: user } = await api.get<User>(`/user/${userId}`)
      expect(user.id).toBe(userId)
      expect(user.name).toBe(mock.name)
      expect(user.email).toBe(mock.email)
    })
  })
})
