import { IController } from '../app/protocols'
import { IRouter } from './protocols'

export class Router implements IRouter {
  'created' = new SaveUserController()
}

export class SaveUserController implements IController {
  async handle(request: SaveUserController.Request): Promise<void> {
    console.log(request)
  }
}

export namespace SaveUserController {
  export interface Request {
    name: string
    email: string
    password: string
  }
}
