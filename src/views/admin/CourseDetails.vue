<template>
  <div class="course-details">
    <h2>Информация о курсе</h2>
    <el-button
      type="default"
      class="back-btn"
      @click="$router.push('/admin/courseList')"
    >
      ← Назад к списку курсов
    </el-button>

    <el-tabs v-model="activeTab">
      <!-- Профиль курса -->
      <el-tab-pane label="Профиль" name="profile">
        <fieldset class="profile-fieldset">
          <legend>Данные курса</legend>
          <div class="profile-grid">
            <div class="profile-row">
              <label class="label-text">Название:</label>
              <div class="value">{{ course.name }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Категория:</label>
              <div class="value">{{ course.category }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Уровень:</label>
              <div class="value">{{ course.level }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Длительность (ч):</label>
              <div class="value">{{ course.durationHours }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Автор:</label>
              <div class="value">{{ course.creator }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Создан:</label>
              <div class="value">{{ formatDate(course.createdAt) }}</div>
            </div>
            <div class="profile-row" v-if="course.modifiedAt">
              <label class="label-text">Изменён:</label>
              <div class="value">{{ formatDate(course.modifiedAt) }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Опубликован:</label>
              <el-tag :type="course.isPublished ? 'success' : 'info'">
                {{ course.isPublished ? 'Да' : 'Нет' }}
              </el-tag>
            </div>
            <div class="profile-actions">
              <el-button 
                type="primary" 
                size="large" 
                @click="router.push(`/admin/courses/edit/${course.courseId}`)">
                Редактировать
              </el-button>
              <el-button type="danger" size="large" @click="deleteCourse">Удалить курс</el-button>
            </div>
          </div>
        </fieldset>
      </el-tab-pane>

      <!-- Список учеников -->
      <el-tab-pane label="Ученики" name="students">
        <el-table :data="students" height="600" stripe>
          <el-table-column prop="firstName" label="Имя" />
          <el-table-column prop="lastName" label="Фамилия" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="enrolledAt" label="Дата записи" />
        </el-table>
      </el-tab-pane>

      <!-- Список уроков -->
      <el-tab-pane label="Уроки" name="lessons">
        <el-table :data="lessons" height="600" stripe>
          <el-table-column prop="lessonId" label="ID урока" />
          <el-table-column prop="title" label="Название" />
          <el-table-column prop="durationMinutes" label="Длительность (мин)" />
          <el-table-column prop="createdAt" label="Создан" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessageBox, ElMessage } from 'element-plus'
import router from '@/router'
import type CourseEntity from '../../../interfaces/courseEntity'
import type lessonEntity from '../../../interfaces/lessonEntity'
import courseService from '../../../services/courseService'
import enrollmentService from '../../../services/enrollmentService'
import lessonService from '../../../services/lessonService'

const route = useRoute()

const course = ref<CourseEntity>({
  courseId: '',
  name: '',
  category: '',
  level: '',
  durationHours: 0,
  creator: '',
  createdAt: new Date(),
  modifiedAt: undefined,
  isPublished: false
})

const students = ref<any[]>([])
const lessons = ref<lessonEntity[]>([])
const activeTab = ref('profile')

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  const id = route.params.id as string
  const data = await courseService.getCourse(id)
  if (data) {
    course.value = data
  }
  lessons.value = await lessonService.getCourseLessons(id)
  loading.close()
})

function formatDate(date: Date | string | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

async function deleteCourse() {
  await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этот курс',
      'Подтверждение',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    )
  const loading = ElLoading.service({ text: 'Загрузка...' })
  await courseService.deleteCourse(course.value.courseId)
  router.push('/admin/courseList')
  ElMessage.success('Курс успешно удалён!')
  loading.close()
}
</script>

<style scoped>
.course-details {
  padding: 30px 40px;
  background-color: #fff;
  min-height: 100vh;
}

h2 {
  font-size: 26px;
  margin-bottom: 24px;
  color: #000;
  text-align: left;
}

.back-btn {
  margin-bottom: 20px;
}

.profile-fieldset {
  display: inline-block;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 6px;
}

.profile-fieldset legend {
  font-weight: 600;
  font-size: 18px;
  color: #000;
  padding: 0 10px;
}

.profile-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.label-text {
  display: inline-block;
  font-weight: 600;
  font-size: 16px;
  width: 140px;
  color: #000;
}

.value {
  font-size: 16px;
  color: #000;
}

.profile-actions {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.el-button {
  padding: 12px 24px;
  font-size: 16px;
}

.el-table {
  font-size: 16px;
}
</style>
