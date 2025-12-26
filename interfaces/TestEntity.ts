export default interface TestEntity {
  testId: string
  lessonId: string
  name: string
  questionCount: number
  attemptRestriction: number
  passingScore: number
  timeLimitMinutes: number
  createdAt: string
  modifiedAt?: string
  isActive: boolean
}
