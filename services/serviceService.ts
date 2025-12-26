import type ServiceEntity from '../interfaces/serviceEntity'
import type createServiceDto from '../dto/createServiceDto'
import type PaginatedResult from '../interfaces/paginatedResult'
import axios from 'axios'

export interface IServiceService {
  getPagedServices(page: number, pageSize: number): Promise<PaginatedResult<ServiceEntity>>
  createService(service: createServiceDto): Promise<void>
  getService(serviceId: string): Promise<ServiceEntity>
  deleteService(serviceId: string): Promise<void>
  updateService(service: createServiceDto): Promise<void>
  getServiceList(): Promise<ServiceEntity[]>
}

export default new class serviceService implements IServiceService {
  public async getPagedServices(page: number, pageSize: number): Promise<PaginatedResult<ServiceEntity>> {
    const response = await axios.get('/api/services/getPaginatedServiceList', { params: { page, pageSize } })
    return response.data
  }

  public async createService(service: createServiceDto): Promise<void> {
    await axios.post('/api/services/createService', service)
  }

  public async getServiceList(): Promise<ServiceEntity[]> {
    const response = await axios.get('/api/services/list')
    return response.data
  }

  public async getService(serviceId: string): Promise<ServiceEntity> {
    const res = await axios.get(`/api/services/getServiceById/${serviceId}`)
    return res.data
  }

  public async deleteService(serviceId: string): Promise<void> {
    await axios.delete(`/api/services/${serviceId}`)
  }

  public async updateService(service: createServiceDto): Promise<void> {
    await axios.post('/api/services/editService', service)
  }
}
