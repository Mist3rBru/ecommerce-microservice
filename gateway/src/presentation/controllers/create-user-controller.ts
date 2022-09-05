import { ICreateUser } from '@/domain/usecases'
import { MissingParamError } from '../errors'
import { badRequest, ok } from '../helpers'
import { IController, HttpResponse } from '../protocols'

export class CreateUserController implements IController {
  constructor(private readonly createUser: ICreateUser) {}

  async handle(request: CreateUserController.Request): Promise<HttpResponse> {
    const { name, email, password } = request
    if (!name) {
      return badRequest(new MissingParamError('name'))
    }
    if (!email) {
      return badRequest(new MissingParamError('email'))
    }
    if (!password) {
      return badRequest(new MissingParamError('password'))
    }
    const user = await this.createUser.create({
      name,
      email,
      password
    })
    return ok(user)
  }
}

export namespace CreateUserController {
  export interface Request {
    name: string
    email: string
    password: string
  }
}
