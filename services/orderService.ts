import axios from 'axios'
import type {OrderServiceItem} from '../interfaces/orderServiceItem'
import type { OrderEntity } from '../interfaces/orderEntity'
import type PaginatedResult from '../interfaces/paginatedResult'

interface OrderItem {
  serviceId: string
  quantity: number
  price: number
}

interface CreateOrderRequest {
  userId: string
  services: OrderItem[]
}

interface CreateOrderResponse {
  orderId: string
  totalPrice: number
  status: string
  createdAt: string
}

class OrderService {
  public async createOrder(payload: CreateOrderRequest): Promise<CreateOrderResponse> {
    const response = await axios.post('/order/create', payload)
    return response.data
  }

  public async getUserOrders(userId: string): Promise<OrderEntity[]> {
    const response = await axios.get('/order/user', { params: { userId } })
    return response.data
  }

  public async getOrderDetails(orderId: string): Promise<OrderServiceItem[]> {
    const response = await axios.get(`/order/details/${orderId}`)
    return response.data
  }

  public async getPagedOrders(page: number, pageSize: number): Promise<PaginatedResult<OrderEntity>> {
    const response = await axios.get<PaginatedResult<OrderEntity>>('/order/paginatedList', { params: { page, pageSize } })
    return response.data
  } 

  public async getOrdersByService(serviceId: string): Promise<OrderEntity[]> { 
    const response = await axios.get('/order/getOrdersByService', { params: { serviceId } }) 
    return response.data 
  }

  public async getOrderById(orderId: string): Promise<OrderEntity> { 
    const response = await axios.get(`/order/getById/${orderId}`) 
    return response.data 
  }

}

export default new OrderService()
