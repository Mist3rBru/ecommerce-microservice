import { IController, IProducer, IRouter } from './protocols'

export class Router implements IRouter {
  'user.created' = new SaveUserController()
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