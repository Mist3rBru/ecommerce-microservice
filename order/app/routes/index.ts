import { Router } from 'express'
import { join } from 'path'
import { v4 as uuid } from 'uuid'
import { readFile, writeFile } from 'fs/promises'
import { Order, User, Product } from '../../models'
import { IProducer } from '@/order/kafka/protocols'

export class Database {
  orderDatabase = join(__dirname, '../../orders.json')
  userDatabase = join(__dirname, '../../users.json')
  productDatabase = join(__dirname, '../../products.json')

  async findOrders(): Promise<Order[]> {
    const db = await readFile(this.orderDatabase)
    return JSON.parse(db.toString())
  }

  async findUsers(): Promise<User[]> {
    const db = await readFile(this.userDatabase)
    return JSON.parse(db.toString())
  }

  async findProducts(): Promise<Product[]> {
    const db = await readFile(this.productDatabase)
    return JSON.parse(db.toString())
  }

  async findUserById(userId: string): Promise<User> {
    const users = await this.findUsers()
    return users.find(user => user.id === userId)
  }

  async findProductById(productId: string): Promise<Product> {
    const products = await this.findProducts()
    return products.find(product => product.id === productId)
  }

  async registerOrder(order: Order): Promise<Order> {
    const orders = await this.findOrders()
    order.id = uuid()
    order.status = 'pending'
    order.createdAt = new Date().toISOString()
    await writeFile(this.orderDatabase, JSON.stringify([...orders, order]))
    return order
  }
}

export default (router: Router, producer: IProducer) => {
  const db = new Database()

  router.post('/order', async (req, res) => {
    const body: Order = req.body
    const user = await db.findUserById(body.user.id)
    const product = await db.findProductById(body.product.id)
    if (!user || !product) {
      return res.status(400).json({
        error: 'user or product does not exist',
      })
    }
    const order = await db.registerOrder(body)
    await producer.send({
      topic: 'order.created',
      value: order
    })
    return res.status(200).json(order)
  })
}
