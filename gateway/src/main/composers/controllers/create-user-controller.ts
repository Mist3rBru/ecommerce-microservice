import { KafkaAdapter } from "@/infra";
import { CreateUserController } from "@/presentation/controllers/create-user-controller";
import { CreateUser } from "@/services/usecases/create-user";

export function makeCreateUserController (): CreateUserController {
  const producer = new KafkaAdapter()
  const createUser = new CreateUser(producer)
  return new CreateUserController(createUser)

} 