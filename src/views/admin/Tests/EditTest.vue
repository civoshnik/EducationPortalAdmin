<template>
  <div class="form-container">
    <h2>Редактировать тест</h2>
    <el-form :model="test" :rules="rules" ref="formRef" label-width="160px">
      <el-form-item label="Название теста" prop="name">
        <el-input v-model="test.name" placeholder="Введите название теста" />
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
        <el-button type="primary" @click="submitForm">Сохранить изменения</el-button>
        <el-button @click="resetForm">Сбросить</el-button>
        <el-button type="danger" @click="cancelEdit">Отмена</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import router from '@/router'
import courseService from '../../../../services/courseService'
import lessonService from '../../../../services/lessonService'
import type lessonEntity from '../../../../interfaces/lessonEntity'
import type TestEntity from '../../../../interfaces/testEntity'

const route = useRoute()
const formRef = ref<FormInstance>()
const lessons = ref<lessonEntity[]>([])
const test = ref<TestEntity>({
  testId: '',
  lessonId: '',
  name: '',
  questionCount: 0,
  attemptRestriction: 1,
  passingScore: 0,
  timeLimitMinutes: 0,
  isActive: true,
  createdAt: '',
  modifiedAt: ''
})

const rules = {
  name: [{ required: true, message: 'Название обязательно', trigger: 'blur' }],
  lessonId: [{ required: true, message: 'Урок обязателен', trigger: 'change' }]
}

onMounted(async () => {
  const id = route.params.id as string
  const loading = ElLoading.service({ text: 'Загрузка теста...' })
  try {
    const data = await courseService.getTestById(id)
    test.value = data
    lessons.value = await lessonService.getLessonList()
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
        await courseService.editTest(test.value)
        ElMessage.success('Тест успешно обновлён')
        router.push(`/admin/tests/details/${test.value.testId}`)
      } catch (error) {
        ElMessage.error('Ошибка при обновлении теста')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelEdit = async () => {
 router.push(`/admin/tests/details/${test.value.testId}`)
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
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
</style>
