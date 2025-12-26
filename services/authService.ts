import axios from 'axios'
import type UserEntity  from '../interfaces/userEntity';
import type RegisterUser from '../interfaces/RegisterUser';
import type auth from '../interfaces/auth';
import type authRespomse from '../interfaces/authResponse'
import type PaginatedResult from '../interfaces/paginatedResult'
import type CourseEntity from '../interfaces/courseEntity';
import type BlackListUserDto from '../dto/blackListUserDto'


export interface IAuthService {
  getUser(id: string): Promise<UserEntity>

  registerUser(formData: RegisterUser) : Promise<void>

  auth(formData: auth) : Promise<authRespomse>

  getPaginatedStudentList(page: number, pageSize: number) : Promise<PaginatedResult<UserEntity>>

  getPaginatedTeacherList(page: number, pageSize: number) : Promise<PaginatedResult<UserEntity>>

  getPaginatedBlackList(page: number, pageSize: number) : Promise<PaginatedResult<BlackListUserDto>>

  getPaginatedAdminList(page: number, pageSize: number) : Promise<PaginatedResult<UserEntity>>

  deleteUser(UserId: string) : Promise<void>

  editPhone(UserId: string, Phone: string) : Promise<void>

  editEmail(UserId: string, Email: string) : Promise<void>

  setUserBlackList(userId: string): Promise<void> 
  
  cancelUserBlackList(userId: string): Promise<void>

  setStudent(userId: string): Promise<void> 
  
  setAdmin(userId: string): Promise<void>
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

    public async getPaginatedAdminList(page: number, pageSize: number): Promise<PaginatedResult<UserEntity>> {
      const response = await axios.get('/auth/paginatedAdminList', {
        params: { page, pageSize }
        })
      return response.data
    }

    public async deleteUser(UserId: string): Promise<void> {
      return await axios.delete(`/auth/deleteUser/${UserId}`)
    }

    public async editPhone(UserId: string, Phone: string) : Promise<void> {
      return await axios.post('/auth/editPhoneUser', {
        UserId: UserId,
        Phone: Phone,
      })
    }

    public async editEmail(UserId: string, Email: string) : Promise<void> {
      return await axios.post('/auth/editEmailUser', {
        UserId: UserId,
        Email: Email,
      })
    }

    public async setUserBlackList(userId: string): Promise<void> { 
      await axios.post(`/auth/setUserBlackList/${userId}`) 
    } 

    public async cancelUserBlackList(userId: string): Promise<void> { 
      await axios.post(`/auth/cancelUserBlackList/${userId}`)
    }

    public async getPaginatedBlackList(page: number, pageSize: number): Promise<PaginatedResult<BlackListUserDto>> {
      const response = await axios.get('/auth/paginatedBlackList', {
        params: { page, pageSize }
        })
      return response.data
    }

    public async setStudent(userId: string): Promise<void> {
      await axios.post(`/auth/setStudent/${userId}`)
    }

    public async setAdmin(userId: string): Promise<void> {
      await axios.post(`/auth/setAdmin/${userId}`)
    }  

}