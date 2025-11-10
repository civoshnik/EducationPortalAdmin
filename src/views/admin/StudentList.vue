<template>
  <div>
    <h2 align="center">Список учеников</h2>
    <el-table :data="courses" style="width: 100%">
      <el-table-column prop="firstName" label="Имя" />
      <el-table-column prop="lastName" label="Фамилия" />
      <el-table-column prop="login" label="Логин" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Роль" />
      <el-table-column prop="phone" label="Телефон" /> 
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openStudent(row.userId)">
          Открыть
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="handlePageChange"
      style="margin-top: 20px; text-align: center;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import authService from '../../../services/authService';
import type UserEntity from '../../../interfaces/userEntity';
import { ElLoading } from 'element-plus';
import { useRouter } from 'vue-router';


const courses = ref<UserEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(100)

const router = useRouter()

const openStudent = async(id: string) => {
  await router.push(`/admin/users/studentList/${id}`)
}

const fetchCourses = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Загружаем студентов...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'Loading',
  })

  try {
    const result = await authService.getPaginatedStudentList(page.value, pageSize.value)
    courses.value = Array.isArray(result) ? result : []
  } catch (error) {
    console.error('Ошибка загрузки студентов:', error)
    courses.value = []
  } finally {
    loadingInstance.close()
  }
}



const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchCourses()
}

onMounted(fetchCourses);
</script>


<style>

h2 {
  color: black;
}

</style>