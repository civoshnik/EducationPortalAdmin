<template>
  <div>
    <h2 align="center">Список уроков</h2>
    <div style="margin: 20px 0; text-align: right;">
      <el-button 
        type="default"
        class="back-btn"
        @click="$router.push('/admin/lessons/create')"
      >
        Добавить урок
      </el-button>
    </div>
    <el-table :data="lessons" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="content" label="Содержание" />
      <el-table-column label="Курс">
        <template #default="scope">
          {{ getCourseName(scope.row.courseId) }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="Создан">
        <template #default="scope">
          {{ new Date(scope.row.createdAt).toLocaleDateString() }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openLesson(row.lessonId)">
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
import lessonService from '../../../services/lessonService'
import courseService from '../../../services/courseService'
import type LessonEntity from '../../../interfaces/lessonEntity'
import type CourseEntity from '../../../interfaces/courseEntity'
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const lessons = ref<LessonEntity[]>([])
const courses = ref<CourseEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchLessons = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    const result = await lessonService.getPagedLessons(page.value, pageSize.value)
    lessons.value = result.items || []
    total.value = result.totalCount || lessons.value.length
    
    courses.value = await courseService.getCourseList()
  } catch (error) {
    console.error('Ошибка загрузки уроков:', error)
    lessons.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const getCourseName = (courseId: string) => {
  const course = courses.value.find(c => c.courseId === courseId)
  return course ? course.name : courseId
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchLessons()
}

const openLesson = async (lessonId: string) => {
  await router.push(`/admin/lessons/details/${lessonId}`)
}

onMounted(fetchLessons)
</script>



<style>

h2 {
  color: black;
}

</style>