<template>
  <div>
    <h2 align="center">Список администраторов</h2>
    <el-table :data="students" style="width: 100%" empty-text="Нет данных">
      <el-table-column prop="firstName" label="Имя" />
      <el-table-column prop="lastName" label="Фамилия" />
      <el-table-column prop="login" label="Логин" />
      <el-table-column prop="email" label="Email" />
      <el-table-column label="Роль">
        <template #default="{ row }">
          {{ roleText(row.role) }}
        </template>
      </el-table-column>
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
import authService from '../../../services/authService'
import type UserEntity from '../../../interfaces/userEntity'
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const students = ref<UserEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const router = useRouter()

const roleText = (role: number) => {
  switch (role) {
    case 0: return 'Администратор'
    case 1: return 'Ученик'
    case 2: return 'Учитель'
    default: return 'Неизвестно'
  }
}

const openStudent = async (id: string) => {
  await router.push({ path: `/admin/users/${id}`, query: { from: 'adminlist' } })
}

const fetchStudents = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })

  try {
    const result = await authService.getPaginatedAdminList(page.value, pageSize.value)
    students.value = result.items || []
    total.value = result.totalCount || students.value.length
  } catch (error) {
    console.error('Ошибка загрузки студентов:', error)
    students.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchStudents()
}

onMounted(fetchStudents)
</script>

<style>
h2 {
  color: black;
}
</style>
