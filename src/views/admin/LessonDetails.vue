<template>
  <div class="lesson-details">
    <h2>Информация об уроке</h2>
    <div>
      <el-button
        type="default"
        class="back-btn"
        @click="$router.push('/admin/lessonList')"
      >
        ← Назад к списку уроков
      </el-button>
    </div>

    <fieldset class="profile-fieldset">
      <legend>Данные урока</legend>
      <div class="profile-grid">
        <div class="profile-row">
          <label class="label-text">Название:</label>
          <div class="value">{{ lesson.name }}</div>
        </div>
        <div class="profile-row">
          <label class="label-text">Курс:</label>
          <div class="value">{{ course?.name }}</div>
        </div>
        <div class="profile-row">
          <label class="label-text">Содержание:</label>
          <div class="value">{{ lesson.content }}</div>
        </div>
        <div class="profile-row">
          <label class="label-text">Видео:</label>
          <div class="value">
            <a :href="lesson.videoUrl" target="_blank">{{ lesson.videoUrl }}</a>
          </div>
        </div>
        <div class="profile-row">
          <label class="label-text">Создан:</label>
          <div class="value">{{ formatDate(lesson.createdAt) }}</div>
        </div>
        <div class="profile-row" v-if="lesson.modifiedAt">
          <label class="label-text">Изменён:</label>
          <div class="value">{{ formatDate(lesson.modifiedAt) }}</div>
        </div>
        <div class="profile-actions">
          <el-button 
            type="primary" 
            size="large" 
            @click="router.push(`/admin/lessons/edit/${lesson.lessonId}`)">
            Редактировать
          </el-button>
          <el-button type="danger" size="large" @click="deleteLesson">Удалить урок</el-button>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading, ElMessageBox, ElMessage } from 'element-plus'
import router from '@/router'
import type lessonEntity from '../../../interfaces/lessonEntity'
import lessonService from '../../../services/lessonService'
import courseService from '../../../services/courseService'
import type CourseEntity from '../../../interfaces/courseEntity'

const route = useRoute()

const lesson = ref<lessonEntity>({
  lessonId: '',
  courseId: '',
  name: '',
  content: '',
  videoUrl: '',
  createdAt: new Date(),
  modifiedAt: undefined
})

const course = ref<CourseEntity | null>(null)

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  const id = String(route.params.id)
  try {
    const data = await lessonService.getLessonById(id)
    if (data) {
      lesson.value = data
      course.value = await courseService.getCourse(lesson.value.courseId)
    }
  } catch (error) {
    ElMessage.error('Ошибка загрузки данных')
    console.error(error)
  } finally {
    loading.close()
  }
})

function formatDate(date: Date | string | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

async function deleteLesson() {
  await ElMessageBox.confirm(
    'Вы уверены, что хотите удалить этот урок?',
    'Подтверждение',
    {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning',
    }
  )
  const loading = ElLoading.service({ text: 'Загрузка...' })
  await lessonService.deleteLesson(lesson.value.lessonId)
  router.push('/admin/lessonList')
  ElMessage.success('Урок успешно удалён!')
  loading.close()
}
</script>


<style scoped>
.lesson-details {
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
</style>
