import { Router } from 'express'
import { adaptController } from '../adapters'
import { makeCreateUserController } from '../composers'

export default (router: Router) => {
  router.post('/user', adaptController(makeCreateUserController()))
  router.get('/users')
}
