import type CourseEntity from '../interfaces/courseEntity';
import axios from 'axios';
import type createCourseDto from '../dto/createCourseDto';
export interface ICourseService {

  getPagedCourses(page: number, pageSize: number): Promise<CourseEntity[]>;

  createCourse(course: createCourseDto): Promise<void>
}


export default new class courseService implements ICourseService {
  public async getPagedCourses(page: number, pageSize: number): Promise<CourseEntity[]> {
    const response = await axios.get('/courses/paged', {
      params: { page, pageSize }
    })
    return response.data
  }
  

  public async createCourse(course: createCourseDto): Promise<void> {
    return await axios.post('/courses/createCourse', course)
    }
}