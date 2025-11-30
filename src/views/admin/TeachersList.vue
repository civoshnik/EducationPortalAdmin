<template>
  <div>
    <h2 align="center">Список учителей</h2>
    <el-table :data="teachers" style="width: 100%" empty-text="Нет данных">
      <el-table-column prop="firstName" label="Имя" />
      <el-table-column prop="lastName" label="Фамилия" />
      <el-table-column prop="login" label="Логин" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Роль" />
      <el-table-column prop="phone" label="Телефон" />
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openTeacher(row.userId)">
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

const teachers = ref<UserEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const router = useRouter()

const openTeacher = async (id: string) => {
  await router.push(`/admin/users/${id}`)
}

const fetchTeachers = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Загружаем учителей...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'el-icon-loading',
  })

  try {
    const result = await authService.getPaginatedTeacherList(page.value, pageSize.value)
    teachers.value = result.items || []
    total.value = result.totalCount || teachers.value.length
  } catch (error) {
    console.error('Ошибка загрузки учителей:', error)
    teachers.value = []
    total.value = 0
  } finally {
    loadingInstance.close()
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchTeachers()
}

onMounted(fetchTeachers)
</script>

<style>
h2 {
  color: black;
}
</style>
