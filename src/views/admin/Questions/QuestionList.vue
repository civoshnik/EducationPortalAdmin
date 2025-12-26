<template>
  <div>
    <h2 align="center">Список вопросов</h2>
    <div style="margin: 20px 0; text-align: right;">
      <el-button type="default" @click="$router.push('/admin/questions/create')">
        Добавить вопрос
      </el-button>
    </div>

    <el-table :data="questions" style="width: 100%">
      <el-table-column prop="text" label="Текст вопроса" />
      <el-table-column prop="type" label="Тип" />
      <el-table-column label="Создан">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openQuestion(row.questionId)">
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
import questionService from '../../../../services/questionService'
import type QuestionEntity from '../../../../interfaces/questionEntity'
import { ElLoading } from 'element-plus'
import router from '@/router'

const questions = ref<QuestionEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function formatDate(date: string | Date) {
  if (!date) return ''
  return new Date(date).toLocaleString('ru-RU')
}

const fetchQuestions = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    const result = await questionService.getPaginatedQuestions(page.value, pageSize.value)
    questions.value = result.items || []
    total.value = result.totalCount || 0
  } catch (error) {
    console.error('Ошибка загрузки вопросов:', error)
    questions.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const openQuestion = async (questionId: string) => {
  await router.push(`/admin/questions/details/${questionId}`)
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchQuestions()
}

onMounted(fetchQuestions)
</script>
