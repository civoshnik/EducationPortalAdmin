<template>
  <div class="test-details">
    <h2>Информация о тесте</h2>
    <el-button
      type="default"
      class="back-btn"
      @click="$router.push('/admin/testList')"
    >
      ← Назад к списку тестов
    </el-button>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Профиль" name="profile">
        <fieldset class="profile-fieldset">
          <legend>Данные теста</legend>
          <div class="profile-grid">
            <div class="profile-row">
              <label class="label-text">Название:</label>
              <div class="value">{{ test.name }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Количество вопросов:</label>
              <div class="value">{{ test.questionCount }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Проходной балл:</label>
              <div class="value">{{ test.passingScore }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Лимит времени:</label>
              <div class="value">{{ test.timeLimitMinutes }} мин.</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Активен:</label>
              <div class="value">{{ test.isActive ? 'Да' : 'Нет' }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Создан:</label>
              <div class="value">{{ formatDate(test.createdAt) }}</div>
            </div>
            <div class="profile-row" v-if="test.modifiedAt">
              <label class="label-text">Изменён:</label>
              <div class="value">{{ formatDate(test.modifiedAt) }}</div>
            </div>
            <div class="profile-actions">
              <el-button 
                type="primary" 
                size="large" 
                @click="router.push(`/admin/tests/edit/${test.testId}`)">
                Редактировать
              </el-button>
              <el-button type="danger" size="large" @click="deleteTest">Удалить тест</el-button>
            </div>
          </div>
        </fieldset>
      </el-tab-pane>

      <el-tab-pane label="Вопросы" name="questions">
        <el-table :data="questions" height="600" stripe>
          <el-table-column prop="questionId" label="ID вопроса" />
          <el-table-column prop="text" label="Текст" />
          <el-table-column prop="type" label="Тип" />
          <el-table-column prop="createdAt" label="Дата создания" />
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
import type TestEntity from '../../../../interfaces/testEntity'
import type QuestionEntity from '../../../../interfaces/questionEntity'
import courseService from '../../../../services/courseService'
import questionService from '../../../../services/questionService'

const route = useRoute()

const test = ref<TestEntity>({
  testId: '',
  lessonId: '',
  name: '',
  questionCount: 0,
  attemptRestriction: 0,
  passingScore: 0,
  timeLimitMinutes: 0,
  createdAt: new Date().toISOString(),
  modifiedAt: undefined,
  isActive: false
})

const questions = ref<QuestionEntity[]>([])
const activeTab = ref('profile')

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  const id = route.params.id as string
  const data = await courseService.getTestById(id)
  if (data) {
    test.value = data
  }
  questions.value = await questionService.getPaginatedQuestions(1, 50).then(r => r.items.filter(q => q.testId === id))
  loading.close()
})

function formatDate(date: Date | string | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

async function deleteTest() {
  await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этот тест?',
      'Подтверждение',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    )
  const loading = ElLoading.service({ text: 'Удаление...' })
  await courseService.deleteTest(test.value.testId)
  router.push('/admin/testList')
  ElMessage.success('Тест успешно удалён!')
  loading.close()
}
</script>

<style scoped>
.test-details {
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
.back-btn { margin-bottom: 20px; }
.profile-fieldset { display: inline-block; border: 1px solid #ccc; padding: 20px; border-radius: 6px; }
.profile-fieldset legend { font-weight: 600; font-size: 18px; color: #000; padding: 0 10px; }
.profile-grid { display: flex; flex-direction: column; gap: 24px; }
.profile-row { display: flex; align-items: center; gap: 20px; }
.label-text { font-weight: 600; font-size: 16px; width: 140px; color: #000; }
.value { font-size: 16px; color: #000; }
.profile-actions { display: flex; gap: 20px; margin-top: 30px; }
.el-button { padding: 12px 24px; font-size: 16px; }
.el-table { font-size: 16px; }
</style>
