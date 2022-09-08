import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { User, Product } from '../models'
import { IRouter, ITopicHandler } from './protocols'

class Database {
  private userDatabase = join(__dirname, '../users.json')
  private productDatabase = join(__dirname, '../products.json')

  async findUsers(): Promise<User[]> {
    const db = await readFile(this.userDatabase)
    return JSON.parse(db.toString())
  }

  async findProducts(): Promise<Product[]> {
    const db = await readFile(this.productDatabase)
    return JSON.parse(db.toString())
  }

  async findUserById (userId: string): Promise<User> {
    const users = await this.findUsers()
    return users.find(user => user.id === userId)
  }

  async findProductById (productId: string): Promise<Product> {
    const products = await this.findUsers()
    return products.find(product => product.id === productId)
  }

  async registerUser(user: User): Promise<User> {
    const users = await this.findUsers()
    await writeFile(this.userDatabase, JSON.stringify([...users, user]))
    return user
  }

  async registerProduct(product: Product): Promise<Product> {
    const products = await this.findProducts()
    await writeFile(this.productDatabase, JSON.stringify([...products, product]))
    return product
  }
}

const db = new Database()

export class Router implements IRouter {
  'user.created' = new HandleUserCreated()
  'product.created' = new HandleProductCreated()
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
