import type questionEntity from '../interfaces/questionEntity';
import axios from 'axios';
export interface IQuestionService {

  getPagedQuestions(page: number, pageSize: number): Promise<questionEntity[]>;
  
}


export default new class questionService implements IQuestionService {
  public async getPagedQuestions(page: number, pageSize: number): Promise<questionEntity[]> {
    const response = await axios.get('/questions/paginatedQueryList', {
      params: { page, pageSize }
    })
    return response.data
  }
}