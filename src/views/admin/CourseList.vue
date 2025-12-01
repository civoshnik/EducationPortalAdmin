<template>
  <div>
    <h2 align="center">Список курсов</h2>
    <div style="margin: 20px 0; text-align: right;">
    <el-button 
      type="default"
      class="back-btn"
      @click="$router.push('/admin/courses/create')"
    >
      Добавить курс
    </el-button>
    </div>

    <el-table :data="courses" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="category" label="Категория" />
      <el-table-column prop="level" label="Уровень" />
      <el-table-column prop="durationHours" label="Длительность (ч)" />
      <el-table-column prop="creator" label="Автор" />
      <el-table-column label="Создан">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="isPublished" label="Опубликован">
        <template #default="{ row }">
          <el-tag :type="row.isPublished ? 'success' : 'info'">
            {{ row.isPublished ? 'Да' : 'Нет' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openCourse(row.courseId)">
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
import courseService from '../../../services/courseService';
import type CourseEntity from '../../../interfaces/courseEntity';
import { ElLoading } from 'element-plus';
import router from '@/router';


const courses = ref<CourseEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(100)
const courseId = ref('')

function formatDate(date: string | Date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchCourses = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })

  try {
    const result = await courseService.getPagedCourses(page.value, pageSize.value)
    courses.value = result.items || []
    total.value = result.totalCount || 0
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
    courses.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const openCourse = async (courseId: string) => {
  await router.push(`/admin/courses/${courseId}`)
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

.el-table {
  font-size: 16px;
}

.el-table .el-table__cell {
  padding: 20px 10px; /* сверху/снизу 20px, слева/справа 10px */
}



</style>