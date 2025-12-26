<template>
  <div>
    <h2 align="center">Список тестов</h2>
    <div style="margin: 20px 0; text-align: right;">
      <el-button type="default" @click="$router.push('/admin/tests/create')">
        Добавить тест
      </el-button>
    </div>

    <el-table :data="tests" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="questionCount" label="Кол-во вопросов" />
      <el-table-column prop="passingScore" label="Проходной балл" />
      <el-table-column label="Создан">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openTest(row.testId)">
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
import courseService from '../../../../services/courseService'
import type TestEntity from '../../../../interfaces/testEntity'
import { ElLoading } from 'element-plus'
import router from '@/router'

const tests = ref<TestEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function formatDate(date: string | Date) {
  if (!date) return ''
  return new Date(date).toLocaleString('ru-RU')
}

const fetchTests = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    const result = await courseService.getPagedTests(page.value, pageSize.value)
    tests.value = result.items || []
    total.value = result.totalCount || 0
  } catch (error) {
    console.error('Ошибка загрузки тестов:', error)
    tests.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const openTest = async (testId: string) => {
  await router.push(`/admin/tests/details/${testId}`)
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchTests()
}

onMounted(fetchTests)
</script>
