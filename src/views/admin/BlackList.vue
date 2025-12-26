<template>
  <div>
    <h2 align="center">Черный список</h2>
    <el-table :data="blacklist" style="width: 100%" empty-text="Нет данных">
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
      <el-table-column prop="blacklistedAt" label="Дата блокировки">
        <template #default="{ row }">
          {{ formatDate(row.blacklistedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openUser(row.userId)">
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
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

interface BlacklistUserDto {
  userId: string
  firstName: string
  lastName: string
  login: string
  email: string
  role: number
  phone: string
  blacklistedAt: string
}

const blacklist = ref<BlacklistUserDto[]>([])
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

const formatDate = (date: string | Date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('ru-RU')
}

const openUser = async (id: string) => {
  await router.push({ path: `/admin/users/${id}`, query: { from: 'blacklist' } })
  
}

const fetchBlacklist = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    const result = await authService.getPaginatedBlackList(page.value, pageSize.value)
    blacklist.value = result.items || []
    total.value = result.totalCount || blacklist.value.length
  } catch (error) {
    console.error('Ошибка загрузки черного списка:', error)
    blacklist.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchBlacklist()
}

onMounted(fetchBlacklist)
</script>

<style scoped>
h2 {
  color: black;
}
</style>
