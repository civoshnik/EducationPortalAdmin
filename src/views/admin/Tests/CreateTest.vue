<template>
  <div class="form-container">
    <h2>Добавить тест</h2>
    <el-form :model="test" :rules="rules" ref="formRef" label-width="180px">
      
      <el-form-item label="Название теста" prop="name">
        <el-input v-model="test.name" placeholder="Например: Итоговый тест по уроку" />
      </el-form-item>

      <el-form-item label="Урок" prop="lessonId">
        <el-select v-model="test.lessonId" placeholder="Выберите урок">
          <el-option
            v-for="lesson in lessons"
            :key="lesson.lessonId"
            :label="lesson.name"
            :value="lesson.lessonId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Количество вопросов" prop="questionCount">
        <el-input-number v-model="test.questionCount" :min="1" />
      </el-form-item>

      <el-form-item label="Ограничение попыток" prop="attemptRestriction">
        <el-input-number v-model="test.attemptRestriction" :min="1" />
      </el-form-item>

      <el-form-item label="Проходной балл" prop="passingScore">
        <el-input-number v-model="test.passingScore" :min="1" />
      </el-form-item>

      <el-form-item label="Лимит времени (мин)" prop="timeLimitMinutes">
        <el-input-number v-model="test.timeLimitMinutes" :min="1" />
      </el-form-item>

      <el-form-item label="Активен" prop="isActive">
        <el-switch v-model="test.isActive" />
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
import courseService from '../../../../services/courseService'
import router from '@/router'
import type lessonEntity from '../../../../interfaces/lessonEntity'
import lessonService from '../../../../services/lessonService'

const lessons = ref<lessonEntity[]>([])
const formRef = ref<FormInstance>()
const test = ref({
  lessonId: '',
  name: '',
  questionCount: 0,
  attemptRestriction: 1,
  passingScore: 0,
  timeLimitMinutes: 0,
  isActive: true
})

const rules = {
  name: [{ required: true, message: 'Название обязательно', trigger: 'blur' }],
  lessonId: [{ required: true, message: 'Урок обязателен', trigger: 'blur' }]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем тест...' })
      try {
        await courseService.createTest(test.value)
        ElMessage.success('Тест успешно добавлен')
        resetForm()
        await router.push('/admin/testList')
      } catch (error) {
        ElMessage.error('Ошибка при добавлении теста')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelAdd = async () => {
  await router.push('/admin/testList')
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
}

onMounted(async () => {
  try {
    lessons.value = await lessonService.getLessonList()
  } catch (error) {
    console.error('Ошибка загрузки уроков:', error)
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
