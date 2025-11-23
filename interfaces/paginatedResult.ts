export default interface paginatedResult<T> {
  items: T[]
  totalCount: number
}