<template>
  <div>
    <h2 align="center">Список уроков</h2>
    <el-table :data="lessons" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="content" label="Содержание" />
      <el-table-column prop="courseId" label="Курс" />
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
import lessonService from '../../../services/lessonService';
import type LessonEntity from '../../../interfaces/lessonEntity';
import { ElLoading } from 'element-plus';


const lessons = ref<LessonEntity[]>([])
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
    const result = await lessonService.getPagedLessons(page.value, pageSize.value)
    lessons.value = Array.isArray(result) ? result : []
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
    lessons.value = []
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