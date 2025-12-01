import type CourseEntity from '../interfaces/courseEntity';
import axios from 'axios';
import type createCourseDto from '../dto/createCourseDto';
import type PaginatedResult from '../interfaces/paginatedResult'
export interface ICourseService {

  getPagedCourses(page: number, pageSize: number): Promise<PaginatedResult<CourseEntity>>

  createCourse(course: createCourseDto): Promise<void>

  getCourse(CourseId: string) : Promise<CourseEntity>

  deleteCourse(CourseId: string) : Promise<void>

  getUserCourses(UserId: string) : Promise<CourseEntity[]>

  updateCourse(course: createCourseDto) : Promise<void>
}


export default new class courseService implements ICourseService {
  public async getPagedCourses(page: number, pageSize: number): Promise<PaginatedResult<CourseEntity>> {
    const response = await axios.get('/courses/paged', {
      params: { page, pageSize }
    })
    return response.data
  }
  
  public async createCourse(course: createCourseDto): Promise<void> {
    return await axios.post('/courses/createCourse', course)
    }

    public async getCourse(CourseId: string): Promise<CourseEntity> {
      const res = await axios.get(`/courses/detail/${CourseId}`)
      return res.data
    }

    public async deleteCourse(CourseId: string): Promise<void> {
      return await axios.delete(`/courses/${CourseId}`)
    }

    public async getUserCourses(UserId: string): Promise<CourseEntity[]> {
      const response = await axios.get(`/courses/${UserId}/courses`)
      return response.data
    }

    public async updateCourse(course: createCourseDto) : Promise<void> {
      return await axios.post('/courses/editCourse', course)
    }
    
}