import express, { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export class App {
  private readonly app: Express
  private readonly router: Router
  constructor() {
    this.app = express()
    this.router = express.Router()
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
      ;(await import(`./routes/${file}`)).default(this.router)
    })
  }

  listen(port: string) {
    this.app.listen(port, () => {
      process.stdout.write(`Server running on port ${port}\n`)
    })
  }
}
