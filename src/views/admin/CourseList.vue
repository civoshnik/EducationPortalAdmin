<template>
  <div>
    <h2 align="center">Список курсов</h2>
    <el-table :data="courses" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="category" label="Категория" />
      <el-table-column prop="level" label="Уровень" />
      <el-table-column prop="durationHours" label="Длительность (ч)" />
      <el-table-column prop="creator" label="Автор" />
      <el-table-column prop="createdAt" label="Создан" />
      <el-table-column prop="isPublished" label="Опубликован">
        <template #default="{ row }">
          <el-tag :type="row.isPublished ? 'success' : 'info'">
            {{ row.isPublished ? 'Да' : 'Нет' }}
          </el-tag>
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
import axios from 'axios'
import courseService from '../../../services/courseService';
import type CourseEntity from '../../../interfaces/courseEntity';
import { ElLoading } from 'element-plus';


const courses = ref<CourseEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(100)

const fetchCourses = async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Загружаем курсы...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'Loading',
  })

  try {
    const result = await courseService.getPagedCourses(page.value, pageSize.value)
    courses.value = Array.isArray(result) ? result : []
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
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