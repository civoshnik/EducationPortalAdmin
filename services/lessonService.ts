import type LessonEntity from '../interfaces/lessonEntity';
import axios from 'axios';
import type paginatedResult from '../interfaces/paginatedResult';
import type lessonEntity from '../interfaces/lessonEntity';
import type createLessonDto from '../dto/createLessonDto';

export interface ILessonService {

  getPagedLessons(page: number, pageSize: number): Promise<paginatedResult<LessonEntity>>

  getCourseLessons(courseId: string) : Promise<lessonEntity[]>

  getLessonById(lessonId: string) : Promise<lessonEntity>

  createLesson(entity: createLessonDto): Promise<void>
  
  updateLesson(entity: createLessonDto): Promise<void>

  deleteLesson(lessonId: string) : Promise<void>

  getLessonList() : Promise<LessonEntity[]>
  
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

  public async getLessonById(lessonId: string): Promise<lessonEntity> {
    const response = await axios.get(`/lessons/${lessonId}/details`)
    return response.data
  }

  public async createLesson(entity: createLessonDto): Promise<void> {
    await axios.post('/lessons/create', entity)
  }

  public async updateLesson(entity: createLessonDto): Promise<void> {
    await axios.post('/lessons/edit', entity)
  }

  public async deleteLesson(lessonId: string): Promise<void> {
    await axios.delete(`/lessons/${lessonId}/delete`)
  }

  public async getLessonList(): Promise<LessonEntity[]> {
      const response = await axios.get('/lessons/getLessonList')
      return response.data
    }
}