import { Router } from "express";
import fs from 'fs/promises'
import path from "path";
import { v4 as uuid } from 'uuid'

interface User {
  id: string
  name: string
  email: string
}

class Database {
  private dbPath = path.join(__dirname, '../../db.json')

  async find (): Promise<User[]> {
    const db = await fs.readFile(this.dbPath)
    return JSON.parse(db.toString())
  }

  async findById (userId: string): Promise<User> {
    const users = await this.find()
    return users.find(user => user.id === userId)
  }

  async register (user: User): Promise<User> {
    const users = await this.find()
    user.id = uuid()
    await fs.writeFile(this.dbPath, JSON.stringify([...users, user]))
    return user
  }
}

export default (router: Router): void  => {
  const db = new Database()
  
  router.post('/user', async (req, res) => {
    const user = await db.register(req.body)
    return res.status(200).json(user)
  })

  router.get('/user/:userId', async (req, res) => {
    const user = await db.findById(req.params.userId)
    return res.status(200).json(user)
  })

  router.get('/users', async (req, res) => {
    const users = await db.find()
    return res.status(200).json(users)
  })
}