export default interface createTestDto {
  testId?: string
  lessonId: string
  name: string
  questionCount: number
  attemptRestriction: number
  passingScore: number
  timeLimitMinutes: number
  isActive: boolean
}
