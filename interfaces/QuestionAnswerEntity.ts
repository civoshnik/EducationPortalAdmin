export interface QuestionAnswerEntity {
  questionAnswerId: string
  questionId: string
  text: string
  isCorrect: boolean
}

export interface QuestionWithAnswersDto {
  questionId: string
  testId: string
  text: string
  type: string
  createdAt: string
  modifiedAt?: string
  answers: QuestionAnswerEntity[]
}
