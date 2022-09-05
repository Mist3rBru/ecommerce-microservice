import express, { Express } from 'express'
import { setupRoutes } from './routes'

export function setupApp(): Express {
  const app = express()
  const router = express.Router()
  app.use(express.json())
  app.use(router)
  setupRoutes(router)
  return app
}
