<template>
  <div class="student-details">
    <h2>Информация о пользователе</h2>
    <el-button
      type="default"
      class="back-btn"
      @click="$router.push('/admin/users/studentList')"
    >
      ← Назад
    </el-button>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Профиль" name="profile">
        <fieldset class="profile-fieldset">
          <legend>Профиль пользователя</legend>
          <div class="profile-grid">
            <div class="profile-row">
              <label class="label-text">Имя:</label>
              <div class="value">{{ student.firstName }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Фамилия:</label>
              <div class="value">{{ student.lastName }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Телефон:</label>
              <el-input v-model="student.phone" size="large" style="max-width: 300px;" />
              <el-button type="primary" size="large">Сохранить</el-button>
            </div>
            <div class="profile-row">
              <label class="label-text">Email:</label>
              <el-input v-model="student.email" size="large" style="max-width: 300px;" />
              <el-button type="primary" size="large">Сохранить</el-button>
            </div>
            <div class="profile-row">
              <label class="label-text">Пароль:</label>
              <el-input v-model="newPassword" type="password" size="large" style="max-width: 300px;" />
              <el-button type="warning" size="large">Сбросить</el-button>
            </div>
            <div class="profile-row">
              <label class="label-text">Роль:</label>
              <div class="value">{{ roleLabel }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">UserId:</label>
              <div class="value">{{ student.userId }}</div>
            </div>
            <div class="profile-actions">
              <el-button type="danger" size="large" @click="deleteAccount">Удалить аккаунт</el-button>
              <el-button type="info" size="large" @click="toggleBlock">
                {{ isBlocked ? 'Разблокировать' : 'Заблокировать' }}
              </el-button>
              <el-button type="success" size="large">Отправить уведомление</el-button>
            </div>
          </div>
        </fieldset>
      </el-tab-pane>

      <el-tab-pane label="Заказы" name="orders">
        <el-table :data="orders" height="600" stripe>
          <el-table-column prop="orderId" label="ID заказа" />
          <el-table-column prop="totalPrice" label="Сумма" />
          <el-table-column prop="status" label="Статус" />
          <el-table-column prop="createdAt" label="Создан" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Курсы" name="courses">
        <el-table :data="enrollments" height="600" stripe>
          <el-table-column prop="courseName" label="Курс" />
          <el-table-column prop="progressPercent" label="Прогресс (%)" />
          <el-table-column prop="status" label="Статус" />
          <el-table-column prop="enrolledAt" label="Дата начала" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import authService from '../../../services/authService'
import type UserEntity from '../../../interfaces/userEntity'
import { ElLoading } from 'element-plus'
import router from '@/router'
import type { orderEntity } from '../../../interfaces/orderEntity'
import orderService from '../../../services/orderService'

const route = useRoute()

const student = ref<UserEntity>({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  role: 0,
  userId: '',
  login: '',
  createdAt: new Date(),
  modifiedAt: new Date()
})

const roleLabel = computed(() => {
  if (student.value.role === 1) return 'Ученик'
  if (student.value.role === 2) return 'Учитель'
  return 'Неизвестно'
})

const orders = ref<orderEntity[]>([])
const enrollments = ref([])
const activeTab = ref('profile')
const isBlocked = ref(false)
const newPassword = ref('')

onMounted(async () => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Загружаем студента...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'el-icon-loading',
  })
  const id = route.params.id as string
  const user = await authService.getUser(id)
  if (user) {
    student.value = user
  }
  orders.value = await orderService.getUserOrders(id)
  loadingInstance.close()
})

async function deleteAccount()
{
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Удаление...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'el-icon-loading',
  })
  await authService.deleteUser(student.value.userId)
  router.push('/admin/users/studentList')
  loadingInstance.close()
}

const toggleBlock = () => {
  isBlocked.value = !isBlocked.value
}
</script>

<style scoped>
.student-details {
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
  margin-bottom: 20px; /* отступ снизу для кнопки "Назад" */
}

.profile-fieldset {
  display: inline-block;   /* fieldset будет подстраиваться под содержимое */
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

.el-table {
  font-size: 16px;
}
</style>
