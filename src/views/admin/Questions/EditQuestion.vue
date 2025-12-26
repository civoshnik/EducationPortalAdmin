<template>
  <div class="form-container">
    <h2>Редактировать вопрос</h2>
    <el-form :model="question" :rules="rules" ref="formRef" label-width="160px">
      
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
        <el-input v-model="question.text" placeholder="Введите текст вопроса" />
      </el-form-item>

      <el-form-item label="Тип вопроса" prop="type">
        <el-select v-model="question.type" placeholder="Выберите тип">
          <el-option label="Один вариант" value="single" />
          <el-option label="Несколько вариантов" value="multiple" />
          <el-option label="Текстовый ответ" value="text" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="question.type !== 'text'" label="Варианты ответов">
        <div v-for="(answer, index) in question.answers" :key="index" style="margin-bottom: 10px;">
          <el-input v-model="answer.text" placeholder="Введите вариант ответа" style="width: 70%;" />
          <el-checkbox v-model="answer.isCorrect" style="margin-left: 10px;" @change="handleCorrectChange(index)">
            Правильный
          </el-checkbox>
          <el-button type="danger" size="small" @click="removeAnswer(index)" style="margin-left: 10px;">Удалить</el-button>
        </div>
        <el-button
          type="success"
          size="small"
          @click="addAnswer"
          :disabled="question.type === 'single' && question.answers.length >= 1"
        >
          Добавить вариант
        </el-button>
      </el-form-item>
      
      <el-form-item v-if="question.type === 'text'" label="Текстовый ответ" prop="textAnswer">
        <el-input v-model="question.textAnswer" placeholder="Введите правильный ответ" />
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import router from '@/router'
import courseService from '../../../../services/courseService'
import questionService from '../../../../services/questionService'
import type TestEntity from '../../../../interfaces/testEntity'
import type { QuestionAnswerEntity } from '../../../../interfaces/questionAnswerEntity'

const route = useRoute()
const formRef = ref<FormInstance>()
const tests = ref<TestEntity[]>([])

const question = ref<any>({
  questionId: '',
  testId: '',
  text: '',
  type: '',
  textAnswer: '',
  answers: [] as QuestionAnswerEntity[]
})

const rules = {
  testId: [{ required: true, message: 'Тест обязателен', trigger: 'change' }],
  text: [{ required: true, message: 'Текст обязателен', trigger: 'blur' }],
  type: [{ required: true, message: 'Тип обязателен', trigger: 'change' }]
}

onMounted(async () => {
  const id = route.params.id as string
  const loading = ElLoading.service({ text: 'Загрузка вопроса...' })
  try {
    const data = await questionService.getQuestionById(id)
    question.value = data
    tests.value = await courseService.getTestsList()
  } catch (error) {
    ElMessage.error('Ошибка загрузки данных')
    console.error(error)
  } finally {
    loading.close()
  }
})

const addAnswer = () => {
  if (question.value.type === 'single' && question.value.answers.length >= 1) return
  question.value.answers.push({ text: '', isCorrect: false })
}

const removeAnswer = (index: number) => {
  question.value.answers.splice(index, 1)
}

const handleCorrectChange = (index: number) => {
  if (question.value.type === 'single') {
    question.value.answers.forEach((a: QuestionAnswerEntity, i: number) => {
      if (i !== index) a.isCorrect = false
    })
  }
}


watch(() => question.value.type, (newType) => {
  question.value.answers = []
  question.value.textAnswer = ''
  if (newType === 'single') {
    question.value.answers.push({ text: '', isCorrect: false })
  }
})

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем изменения...' })
      try {
        await questionService.editQuestion(question.value)
        ElMessage.success('Вопрос успешно обновлён')
        router.push(`/admin/questions/details/${question.value.questionId}`)
      } catch (error) {
        ElMessage.error('Ошибка при обновлении вопроса')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelEdit = async () => {
  await router.push(`/admin/questions/details/${question.value.questionId}`)
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
