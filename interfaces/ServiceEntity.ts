export default interface ServiceEntity {
  serviceId: string
  name: string
  price: number
  createdAt: Date
  modifiedAt?: Date | undefined
}
