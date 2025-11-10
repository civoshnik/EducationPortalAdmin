export default interface CreateCourseDto {
  name: string
  category: string
  level: string
  durationHours: number
  creator: string
  isPublished: boolean
}