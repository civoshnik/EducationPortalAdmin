import axios from 'axios'
import type CourseEntity from '../interfaces/courseEntity'
import type TestEntity from '../interfaces/testEntity'
import type createCourseDto from '../dto/createCourseDto'
import type createTestDto from '../dto/createTestDto'
import type PaginatedResult from '../interfaces/paginatedResult'

export interface ICourseService {
  getPagedCourses(page: number, pageSize: number): Promise<PaginatedResult<CourseEntity>>
  createCourse(course: createCourseDto): Promise<void>
  getCourse(courseId: string): Promise<CourseEntity>
  deleteCourse(courseId: string): Promise<void>
  getUserCourses(userId: string): Promise<CourseEntity[]>
  updateCourse(course: createCourseDto): Promise<void>
  getCourseList(): Promise<CourseEntity[]>

  // тесты
  getPagedTests(page: number, pageSize: number): Promise<PaginatedResult<TestEntity>>
  createTest(test: createTestDto): Promise<void>
  editTest(test: createTestDto): Promise<void>
  deleteTest(testId: string): Promise<void>
  getTestById(testId: string): Promise<TestEntity>
  getTestsList() : Promise<TestEntity[]>
}

export default new class courseService implements ICourseService {
  public async getPagedCourses(page: number, pageSize: number): Promise<PaginatedResult<CourseEntity>> {
    const response = await axios.get('/courses/paged', { params: { page, pageSize } })
    return response.data
  }

  public async createCourse(course: createCourseDto): Promise<void> {
    await axios.post('/courses/createCourse', course)
  }

  public async getCourseList(): Promise<CourseEntity[]> {
    const response = await axios.get('/courses/list')
    return response.data
  }

  public async getCourse(courseId: string): Promise<CourseEntity> {
    const res = await axios.get(`/courses/detail/${courseId}`)
    return res.data
  }

  public async deleteCourse(courseId: string): Promise<void> {
    await axios.delete(`/courses/${courseId}`)
  }

  public async getUserCourses(userId: string): Promise<CourseEntity[]> {
    const response = await axios.get(`/courses/${userId}/courses`)
    return response.data
  }

  public async updateCourse(course: createCourseDto): Promise<void> {
    await axios.post('/courses/editCourse', course)
  }

  // --- тесты ---
  public async getPagedTests(page: number, pageSize: number): Promise<PaginatedResult<TestEntity>> {
    const response = await axios.get('/courses/paginatedTestList', { params: { page, pageSize } })
    return response.data
  }

  public async getTestById(testId: string): Promise<TestEntity> {
  const res = await axios.get(`/courses/testDetail/${testId}`)
  return res.data
}

  public async createTest(test: createTestDto): Promise<void> {
    await axios.post('/courses/createTest', test)
  }

  public async editTest(test: createTestDto): Promise<void> {
    await axios.post('/courses/editTest', test)
  }

  public async deleteTest(testId: string): Promise<void> {
    await axios.delete(`/courses/deleteTest/${testId}`)
  }

  public async getTestsList(): Promise<TestEntity[]> {
    const response = await axios.get('/courses/getTestsList')
    return response.data
  }
}
