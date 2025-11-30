import type LessonEntity from '../interfaces/lessonEntity';
import axios from 'axios';
import type paginatedResult from '../interfaces/paginatedResult';
import type lessonEntity from '../interfaces/lessonEntity';

export interface ILessonService {

  getPagedLessons(page: number, pageSize: number): Promise<paginatedResult<LessonEntity>>;
  
}


export default new class lessonService implements ILessonService {
  public async getPagedLessons(page: number, pageSize: number): Promise<paginatedResult<LessonEntity>> {
    const response = await axios.get('/lessons/paginatedLessonList', {
      params: { page, pageSize }
    })
    return response.data
  }

  public async getCourseLessons(courseId: string): Promise<lessonEntity[]> {
    const response = await axios.get(`/courses/${courseId}/lessons`)
    return response.data
  }
}