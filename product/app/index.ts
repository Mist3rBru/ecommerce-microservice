import express, { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'
import { IProducer } from '../kafka/protocols'

export class App {
  private readonly app: Express
  private readonly router: Router
  private readonly producer: IProducer
  constructor(producer: IProducer) {
    this.app = express()
    this.router = express.Router()
    this.producer = producer
    this.setupMiddlewares()
    this.setupRoutes()
  }

  private setupMiddlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(this.router)
  }

  private setupRoutes(): void {
    readdirSync(resolve(__dirname, './routes')).map(async file => {
      ;(await import(`./routes/${file}`)).default(this.router, this.producer)
    })
  }

  listen(port: string) {
    this.app.listen(port, () => {
      process.stdout.write(`Server running on port ${port}\n`)
    })
  }
}
