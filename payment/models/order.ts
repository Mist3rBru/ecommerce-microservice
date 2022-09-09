import { Product } from "./product"
import { User } from "./user"

export interface Order {
  id: string
  user: User
  product: Product
  status: string
  createdAt: string
}