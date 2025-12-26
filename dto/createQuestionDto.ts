export default interface createQuestionDto {
  questionId?: string
  testId: string
  text: string
  type: string
  answers: { text: string; isCorrect: boolean }[]
}
