import type LessonEntity from '../interfaces/lessonEntity';
import axios from 'axios';
export interface ILessonService {

  getPagedLessons(page: number, pageSize: number): Promise<LessonEntity[]>;
  
}


export default new class lessonService implements ILessonService {
  public async getPagedLessons(page: number, pageSize: number): Promise<LessonEntity[]> {
    const response = await axios.get('/lessons/paginatedLessonList', {
      params: { page, pageSize }
    })
    return response.data
  }
}