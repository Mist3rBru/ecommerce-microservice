import express, { Express } from 'express'
import { setupRouter } from './router'

export function setupApp(): Express {
  const app = express()
  const router = express.Router()
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(router)
  setupRouter(router)
  return app
}
