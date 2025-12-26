<template>
  <div class="form-container">
    <h2>Добавить курс по видеомонтажу</h2>
    <el-form :model="course" :rules="rules" ref="formRef" label-width="140px">
      <el-form-item label="Название курса" prop="name">
        <el-input v-model="course.name" placeholder="Например: Основы монтажа в Premiere Pro" />
      </el-form-item>

      <el-form-item label="Категория" prop="category">
        <el-select v-model="course.category" placeholder="Выберите категорию">
          <el-option label="Художественный" value="Художественный" />
          <el-option label="Коммерческий" value="Коммерческий" />
          <el-option label="Музыкальный клип" value="Музыкальный клип" />
          <el-option label="YouTube-контент" value="YouTube-контент" />
        </el-select>
      </el-form-item>

      <el-form-item label="Уровень" prop="level">
        <el-select v-model="course.level" placeholder="Выберите уровень">
          <el-option label="Начальный" value="Начальный" />
          <el-option label="Средний" value="Средний" />
          <el-option label="Продвинутый" value="Продвинутый" />
        </el-select>
      </el-form-item>

      <el-form-item label="Длительность (ч)" prop="durationHours">
        <el-input-number v-model="course.durationHours" :min="1" />
      </el-form-item>

      <el-form-item label="Автор курса" prop="creator">
        <el-input v-model="course.creator" placeholder="Имя автора или студии" />
      </el-form-item>

      <el-form-item label="Опубликован" prop="isPublished">
        <el-switch v-model="course.isPublished" />
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
import { ref } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import courseService from '../../../services/courseService'
import router from '@/router'

const formRef = ref<FormInstance>()
const course = ref({
  name: '',
  category: '',
  level: '',
  durationHours: 1,
  creator: '',
  isPublished: false,
})

const rules = {
  name: [{ required: true, message: 'Название обязательно', trigger: 'blur' }],
  category: [{ required: true, message: 'Выберите категорию', trigger: 'change' }],
  level: [{ required: true, message: 'Выберите уровень', trigger: 'change' }],
  durationHours: [{ required: true, message: 'Укажите длительность', trigger: 'blur' }],
  creator: [{ required: true, message: 'Имя автора обязательно', trigger: 'blur' }],
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем курс...' })
      try {
        await courseService.createCourse(course.value)
        ElMessage.success('Курс успешно добавлен')
        resetForm()
        await router.push("/admin/courseList")
      } catch (error) {
        ElMessage.error('Ошибка при добавлении курса')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelAdd = async () => {
  await router.push("/admin/courseList")
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
