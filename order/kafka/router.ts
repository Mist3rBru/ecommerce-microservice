import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { User, Product, Order } from '@/order/models'
import { IRouter, ITopicHandler } from '@/order/kafka/protocols'

interface OrderResult {
  id: string
  status: string
}

export class Database {
  userDatabase = join(__dirname, '../users.json')
  productDatabase = join(__dirname, '../products.json')
  orderDatabase = join(__dirname, '../orders.json')

  async registerUser(user: User): Promise<User> {
    const users = await this.findUsers()
    await writeFile(this.userDatabase, JSON.stringify([...users, user]))
    return user
  }

  async findUsers(): Promise<User[]> {
    const db = await readFile(this.userDatabase)
    return JSON.parse(db.toString())
  }

  async findUserById(userId: string): Promise<User> {
    const users = await this.findUsers()
    return users.find(user => user.id === userId)
  }

  async registerProduct(product: Product): Promise<Product> {
    const products = await this.findProducts()
    await writeFile(
      this.productDatabase,
      JSON.stringify([...products, product])
    )
    return product
  }

  async findProducts(): Promise<Product[]> {
    const db = await readFile(this.productDatabase)
    return JSON.parse(db.toString())
  }

  async findProductById(productId: string): Promise<Product> {
    const products = await this.findUsers()
    return products.find(product => product.id === productId)
  }

  async findOrders(): Promise<Order[]> {
    const db = await readFile(this.orderDatabase)
    return JSON.parse(db.toString())
  }

  async updateOrder(orderResult: OrderResult): Promise<void> {
    const orders = await this.findOrders()
    for (const order of orders) {
      if (order.id === orderResult.id) {
        order.status = orderResult.status
        break
      }
    }
    await writeFile(db.orderDatabase, JSON.stringify(orders))
  }
}

const db = new Database()

export class Router implements IRouter {
  'user.created' = new HandleUserCreated()
  'product.created' = new HandleProductCreated()
  'order.result' = new HandleOrderResult()
}

export class HandleUserCreated implements ITopicHandler {
  async handle(user: User): Promise<void> {
    const exists = await db.findUserById(user.id)
    if (!exists) {
      await db.registerUser(user)
    }
  }
}

export class HandleProductCreated implements ITopicHandler {
  async handle(product: Product): Promise<void> {
    const exists = await db.findProductById(product.id)
    if (!exists) {
      await db.registerProduct(product)
    }
  }
}

export class HandleOrderResult implements ITopicHandler {
  async handle(orderResult: OrderResult): Promise<void> {
    await db.updateOrder(orderResult)
  }
}
