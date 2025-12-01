<template>
  <div class="form-container">
    <h2>Редактировать курс по видеомонтажу</h2>
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
        <el-button type="primary" @click="submitForm">Сохранить изменения</el-button>
        <el-button @click="resetForm">Сбросить</el-button>
        <el-button type="danger" @click="cancelEdit">Отмена</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import courseService from '../../../services/courseService'
import router from '@/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const formRef = ref<FormInstance>()

const course = ref({
  courseId: '',
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

// Загружаем курс по ID
onMounted(async () => {
  const id = String(route.params.id)
  const loading = ElLoading.service({ text: 'Загружаем курс...' })
  try {
    const loaded = await courseService.getCourse(id)
    course.value = {
      courseId: loaded.courseId,
      name: loaded.name,
      category: loaded.category,
      level: loaded.level,
      durationHours: loaded.durationHours,
      creator: loaded.creator,
      isPublished: loaded.isPublished,
    }
  } catch (error) {
    ElMessage.error('Ошибка при загрузке курса')
    console.error(error)
    router.push('/admin/courseList')
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
        await courseService.updateCourse(course.value)
        ElMessage.success('Курс успешно обновлён')
        router.push('/admin/courseList')
      } catch (error) {
        ElMessage.error('Ошибка при обновлении курса')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelEdit = async () => {
  await router.push(`/admin/courses/${course.value.courseId}`)
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
