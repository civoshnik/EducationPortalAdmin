<template>
  <div class="form-container">
    <h2>Добавить урок</h2>
    <el-form :model="lesson" :rules="rules" ref="formRef" label-width="140px">
      <el-form-item label="Название урока" prop="name">
        <el-input v-model="lesson.name" placeholder="Например: Основы монтажа" />
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
        <el-button type="primary" @click="submitForm">Сохранить</el-button>
        <el-button @click="resetForm">Сбросить</el-button>
        <el-button type="danger" @click="cancelAdd">Отмена</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import router from '@/router'
import lessonService from '../../../services/lessonService'
import type createLessonDto from '../../../dto/createLessonDto'
import type CourseEntity from '../../../interfaces/courseEntity'
import courseService from '../../../services/courseService'

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

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем урок...' })
      try {
        await lessonService.createLesson(lesson.value)
        ElMessage.success('Урок успешно добавлен')
        resetForm()
        router.push('/admin/lessonList')
      } catch (error) {
        ElMessage.error('Ошибка при добавлении урока')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelAdd = async () => {
  await router.push('/admin/lessonList')
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
}

onMounted(async () => {
    try {
    courses.value = await courseService.getCourseList()
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error)
  }
})
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
