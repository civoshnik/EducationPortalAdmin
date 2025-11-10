<template>
  <div>
    <h2 align="center">Список вопросов</h2>
    <el-table :data="questions" style="width: 100%">
      <el-table-column prop="text" label="Текст вопроса" />
      <el-table-column prop="type" label="Тип" />
      <el-table-column prop="testId" label="Тест" />
      <el-table-column prop="createdAt" label="Создан" />
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
import axios from 'axios'
import questionService from '../../../services/questionService';
import type questionEntity from '../../../interfaces/questionEntity';
import { ElLoading } from 'element-plus';


const questions = ref<questionEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(100)

const fetchCourses = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Загружаем курсы...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'el-icon-loading',
  })

  try {
    const result = await questionService.getPagedQuestions(page.value, pageSize.value)
    questions.value = Array.isArray(result) ? result : []
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
    questions.value = []
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