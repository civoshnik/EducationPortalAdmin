import axios from 'axios'
import type QuestionEntity from '../interfaces/questionEntity'
import type createQuestionDto from '../dto/createQuestionDto'
import type PaginatedResult from '../interfaces/paginatedResult'
import type { QuestionAnswerEntity } from '../interfaces/questionAnswerEntity'

export interface QuestionWithAnswersDto {
  questionId: string
  testId: string
  text: string
  type: string
  createdAt: string
  modifiedAt?: string
  answers: QuestionAnswerEntity[]
}

export interface IQuestionService {
  getPaginatedQuestions(page: number, pageSize: number): Promise<PaginatedResult<QuestionEntity>>
  getQuestionById(questionId: string): Promise<QuestionWithAnswersDto>
  createQuestion(question: createQuestionDto): Promise<void>
  editQuestion(question: createQuestionDto): Promise<void>
  deleteQuestion(questionId: string): Promise<void>
}

export default new class questionService implements IQuestionService {
  public async getPaginatedQuestions(page: number, pageSize: number): Promise<PaginatedResult<QuestionEntity>> {
    const res = await axios.get('/questions/paginatedQueryList', { params: { page, pageSize } })
    return res.data
  }

  public async getQuestionById(questionId: string): Promise<QuestionWithAnswersDto> {
    const res = await axios.get(`/questions/${questionId}`)
    return res.data as QuestionWithAnswersDto
  }

  public async createQuestion(question: createQuestionDto): Promise<void> {
    await axios.post('/questions/createQuestion', question)
  }

  public async editQuestion(question: createQuestionDto): Promise<void> {
    await axios.post('/questions/editQuestion', question)
  }

  public async deleteQuestion(questionId: string): Promise<void> {
    await axios.delete(`/questions/deleteQuestion/${questionId}`)
  }
}
