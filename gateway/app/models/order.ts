import { User } from "./user"

export interface Order {
  id: string
  user: User
  product: {
    id: string
  }
  status: string
  createdAt: Date
}