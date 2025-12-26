<template>
  <div class="form-container">
    <h2>Добавить вопрос</h2>
    <el-form :model="question" :rules="rules" ref="formRef" label-width="180px">
      <el-form-item label="Тест" prop="testId">
        <el-select v-model="question.testId" placeholder="Выберите тест">
          <el-option
            v-for="test in tests"
            :key="test.testId"
            :label="test.name"
            :value="test.testId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Текст вопроса" prop="text">
        <el-input v-model="question.text" placeholder="Например: как использовать инструмент Paint Tool?" />
      </el-form-item>

      <el-form-item label="Тип вопроса" prop="type">
        <el-select v-model="question.type" placeholder="Выберите тип">
          <el-option label="Один вариант" value="single" />
          <el-option label="Несколько вариантов" value="multiple" />
          <el-option label="Текстовый ответ" value="text" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="question.type === 'text'" label="Ответ (текст)" prop="textAnswer">
        <el-input
          v-model="question.textAnswer"
          placeholder="Введите правильный текстовый ответ"
        />
      </el-form-item>
      <el-form-item v-if="question.type === 'single' || question.type === 'multiple'" label="Варианты ответов">
        <div v-for="(answer, index) in question.answers" :key="index" style="margin-bottom: 10px;">
          <el-input v-model="answer.text" placeholder="Введите вариант ответа" style="width: 70%;" />
          <el-checkbox v-model="answer.isCorrect" style="margin-left: 10px;" @change="handleCorrectChange(index)">
            Правильный
          </el-checkbox>
          <el-button type="danger" size="small" @click="removeAnswer(index)" style="margin-left: 10px;">
            Удалить
          </el-button>
        </div>

        <el-button
          type="success"
          size="small"
          @click="addAnswer"
          :disabled="!question.type || (question.type === 'single' && question.answers.length >= 1)"
        >
          Добавить вариант
        </el-button>
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
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import questionService from '../../../../services/questionService'
import courseService from '../../../../services/courseService'
import router from '@/router'
import type TestEntity from '../../../../interfaces/testEntity'

const formRef = ref<FormInstance>()
const tests = ref<TestEntity[]>([])

const question = ref({
  testId: '',
  text: '',
  type: '',
  textAnswer: '',
  answers: [] as { text: string; isCorrect: boolean }[]
})

const addAnswer = () => {
  if (!question.value.type) return
  if (question.value.type === 'single' && question.value.answers.length >= 1) return
  question.value.answers.push({ text: '', isCorrect: false })
}

const removeAnswer = (index: number) => {
  question.value.answers.splice(index, 1)
}

const handleCorrectChange = (index: number) => {
  if (question.value.type === 'single') {
    question.value.answers.forEach((a, i) => { if (i !== index) a.isCorrect = false })
  }
}

watch(() => question.value.type, (newType) => {
  question.value.answers = []
  question.value.textAnswer = ''

  if (newType === 'single') {
    question.value.answers.push({ text: '', isCorrect: false })
  }
})

const rules = {
  testId: [{ required: true, message: 'Тест обязателен', trigger: 'change' }],
  text: [{ required: true, message: 'Текст вопроса обязателен', trigger: 'blur' }],
  type: [{ required: true, message: 'Тип обязателен', trigger: 'change' }],
  textAnswer: [
    {
      validator: (_: any, value: string, callback: (err?: Error) => void) => {
        if (question.value.type === 'text' && (!value || !value.trim())) {
          callback(new Error('Текстовый ответ обязателен'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const validateAnswersForChoiceTypes = (): boolean => {
  if (question.value.type === 'single' || question.value.type === 'multiple') {
    if (question.value.answers.length === 0) {
      ElMessage.error('Добавьте хотя бы один вариант ответа')
      return false
    }
    const hasEmpty = question.value.answers.some(a => !a.text || !a.text.trim())
    if (hasEmpty) {
      ElMessage.error('Заполните текст всех вариантов ответа')
      return false
    }
    if (question.value.type === 'single') {
      const correctCount = question.value.answers.filter(a => a.isCorrect).length
      if (correctCount !== 1) {
        ElMessage.error('Для типа "Один вариант" должен быть ровно один правильный ответ')
        return false
      }
    } else {
      const hasCorrect = question.value.answers.some(a => a.isCorrect)
      if (!hasCorrect) {
        ElMessage.error('Для типа "Несколько вариантов" отметьте хотя бы один правильный ответ')
        return false
      }
    }
  }
  return true
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (!validateAnswersForChoiceTypes()) return
    if (question.value.type === 'text') {
      const val = question.value.textAnswer?.trim()
      if (!val) {
        ElMessage.error('Текстовый ответ обязателен')
        return
      }
    }

    const loading = ElLoading.service({ text: 'Сохраняем вопрос...' })
    try {
      const payload =
        question.value.type === 'text'
          ? {
              testId: question.value.testId,
              text: question.value.text,
              type: question.value.type,
              answers: [{ text: question.value.textAnswer, isCorrect: true }]
            }
          : question.value

      await questionService.createQuestion(payload as any)
      ElMessage.success('Вопрос успешно добавлен')
      resetForm()
      await router.push('/admin/questionList')
    } catch (error) {
      ElMessage.error('Ошибка при добавлении вопроса')
      console.error(error)
    } finally {
      loading.close()
    }
  })
}

const cancelAdd = async () => {
  await router.push('/admin/questionList')
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
  question.value.answers = []
  question.value.textAnswer = ''
}

onMounted(async () => {
  try {
    if ((courseService as any).getTestsList) {
      tests.value = await (courseService as any).getTestsList()
    } else {
      const res = await courseService.getPagedTests(1, 50)
      tests.value = res.items || []
    }
  } catch (error) {
    console.error('Ошибка загрузки тестов:', error)
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
