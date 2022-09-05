import { Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export function setupRoutes(router: Router): void {
  readdirSync(resolve(__dirname, '../routes')).map(async file => {
    ;(await import(`../routes/${file}`)).default(router)
  })
}
