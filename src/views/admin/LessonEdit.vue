<template>
  <div class="form-container">
    <h2>Редактировать урок</h2>
    <el-form :model="lesson" :rules="rules" ref="formRef" label-width="140px">
      <el-form-item label="Название урока" prop="name">
        <el-input v-model="lesson.name" placeholder="Введите название урока" />
      </el-form-item>

      <el-form-item label="Содержание" prop="content">
        <el-input
          type="textarea"
          v-model="lesson.content"
          placeholder="Опишите содержание урока"
          rows="4"
        />
      </el-form-item>

      <el-form-item label="Видео URL" prop="videoUrl">
        <el-input v-model="lesson.videoUrl" placeholder="Ссылка на видео" />
      </el-form-item>

      <el-form-item label="Курс" prop="courseId">
        <el-select v-model="lesson.courseId" placeholder="Выберите курс">
          <el-option
            v-for="course in courses"
            :key="course.courseId"
            :label="course.name"
            :value="course.courseId"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">Сохранить изменения</el-button>
        <el-button @click="resetForm">Сбросить</el-button>
        <el-button type="danger" @click="cancelEdit">Отмена</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import router from '@/router'
import lessonService from '../../../services/lessonService'
import type createLessonDto from '../../../dto/createLessonDto'
import type CourseEntity from '../../../interfaces/courseEntity'
import courseService from '../../../services/courseService'

const route = useRoute()
const formRef = ref<FormInstance>()
const courses = ref<CourseEntity[]>([])
const lesson = ref<createLessonDto>({
    name: '',
    content: '',
    videoUrl: '',
    courseId: ''
})

const rules = {
  name: [{ required: true, message: 'Название обязательно', trigger: 'blur' }],
  content: [{ required: true, message: 'Содержание обязательно', trigger: 'blur' }],
  videoUrl: [{ required: true, message: 'Укажите ссылку на видео', trigger: 'blur' }],
  courseId: [{ required: true, message: 'Укажите курс', trigger: 'blur' }]
}

onMounted(async () => {
  const id = route.params.id as string
  const loading = ElLoading.service({ text: 'Загрузка урока...' })
  try {
    const data = await lessonService.getLessonById(id)
    lesson.value = data

    courses.value = await courseService.getCourseList()
  } catch (error) {
    ElMessage.error('Ошибка загрузки данных')
    console.error(error)
  } finally {
    loading.close()
  }
})

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем изменения...' })
      try {
        await lessonService.updateLesson(lesson.value)
        ElMessage.success('Урок успешно обновлён')
        router.push('/admin/lessonList')
      } catch (error) {
        ElMessage.error('Ошибка при обновлении урока')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelEdit = async () => {
  await router.push(`/admin/lessons/details/${lesson.value.lessonId}`)
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
}
</script>

<style scoped>
.form-container {
  max-width: 650px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
</style>
