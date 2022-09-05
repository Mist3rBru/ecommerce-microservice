import { ICreateUser } from "@/domain/usecases";
import { IProducer } from "../protocols";
import { v4 as uuid } from 'uuid'

export class CreateUser implements ICreateUser {
  constructor (
    private readonly producer: IProducer
  ) {}
  
  async create(params: ICreateUser.Params): Promise<ICreateUser.Result> {
    this.producer.send({
      topic: 'user.created',
      value: params
    })
    return {
      id: uuid(),
      name: params.name,
      email: params.email
    }
  }
}