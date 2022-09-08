import { Router } from "express";
import { v4 as uuid } from 'uuid'
import fs from 'fs/promises'
import path from "path";

interface Product {
  id: string
  name: string
  price: string
}

class Database {
  private dbPath = path.join(__dirname, '../../db.json')

  async find (): Promise<Product[]> {
    const db = await fs.readFile(this.dbPath)
    return JSON.parse(db.toString())
  }

  async findById (productId: string): Promise<Product> {
    const products = await this.find()
    return products.find(product => product.id === productId)
  }

  async register (product: Product): Promise<Product> {
    const products = await this.find()
    product.id = uuid()
    await fs.writeFile(this.dbPath, JSON.stringify([...products, product]))
    return product
  }
}

export default (router: Router): void  => {
  const db = new Database()
  
  router.post('/product', async (req, res) => {
    const product = await db.register(req.body)
    return res.status(200).json(product)
  })

  router.get('/product/:productId', async (req, res) => {
    const product = await db.findById(req.params.productId)
    return res.status(200).json(product)
  })

  router.get('/products', async (req, res) => {
    const products = await db.find()
    return res.status(200).json(products)
  })
}