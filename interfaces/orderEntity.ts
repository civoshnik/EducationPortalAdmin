import type { OrderServiceItem } from "./orderServiceItem"

export interface OrderEntity {
  orderId: string
  userId: string
  totalPrice: number
  status: string
  createdAt: string
  modifiedAt?: string
  services: OrderServiceItem[]
}
