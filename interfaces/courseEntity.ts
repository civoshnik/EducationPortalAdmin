export default interface CourseEntity {
  courseId: string
  name: string
  category: string
  level: string
  durationHours: number
  creator: string
  createdAt: Date
  modifiedAt?: Date | undefined
  isPublished: boolean
}
