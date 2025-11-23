import axios from 'axios'
import type UserEntity  from '../interfaces/userEntity';
import type RegisterUser from '../interfaces/RegisterUser';
import type auth from '../interfaces/auth';
import type authRespomse from '../interfaces/authResponse'
import type PaginatedResult from '../interfaces/paginatedResult'


export interface IAuthService {
  getUser(id: string): Promise<UserEntity>;

  registerUser(formData: RegisterUser) : Promise<void>;

  auth(formData: auth) : Promise<authRespomse>;

  getPaginatedStudentList(page: number, pageSize: number) : Promise<PaginatedResult<UserEntity>>;

  getPaginatedTeacherList(page: number, pageSize: number) : Promise<PaginatedResult<UserEntity>>;

  deleteUser(UserId: string) : Promise<void>;
}

export default new class authService implements IAuthService {
    public async getUser(id: string): Promise<UserEntity> {
        const response = await axios.get(`/auth/getUser/${id}`);
        return response.data;
    }

    public async registerUser(formData: RegisterUser) : Promise<void> {
      return await axios.post('/auth/registrationUser', formData);
    }

    public async auth(formData: auth): Promise<authRespomse> {
      const response = await axios.post('auth/autorizationUser', formData);
      return response.data;
    }

    public async getPaginatedStudentList(page: number, pageSize: number): Promise<PaginatedResult<UserEntity>> {
      const response = await axios.get('/auth/paginatedStudentList', {
        params: { page, pageSize }
        })
      return response.data
    }

    public async getPaginatedTeacherList(page: number, pageSize: number): Promise<PaginatedResult<UserEntity>> {
      const response = await axios.get('/auth/paginatedTeacherList', {
        params: { page, pageSize }
        })
      return response.data
    }

    public async deleteUser(UserId: string): Promise<void> {
      return await axios.delete(`/auth/deleteUser/${UserId}`)
    }
}