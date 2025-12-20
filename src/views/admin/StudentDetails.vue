<template>
  <div class="student-details">
    <h2>Информация о пользователе</h2>
    <el-button v-if="student.role === 1"
      type="default"
      class="back-btn"
      @click="$router.push('/admin/users/studentList')"
    >
      ← Назад к списку учеников
    </el-button>
    <el-button v-if="student.role === 2"
      type="default"
      class="back-btn"
      @click="$router.push('/admin/users/teacherList')"
    >
      ← Назад к списку учителей
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
              <el-button type="primary" size="large" @click="updatePhone">Сохранить</el-button>
            </div>
            <div class="profile-row">
              <label class="label-text">Email:</label>
              <el-input v-model="student.email" size="large" style="max-width: 300px;" />
              <el-button type="primary" size="large" @click="updateEmail">Сохранить</el-button>
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
          <el-table-column label="Статус">
            <template #default="{ row }">
              {{ statusText(row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="Создан">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="Курсы" name="courses">
        <el-table :data="courses" height="600" stripe>
          <el-table-column prop="name" label="Курс" />
          <el-table-column prop="category" label="Категория" />
          <el-table-column prop="level" label="Уровень" />
          <el-table-column prop="durationHours" label="Длительность" />
          <el-table-column prop="creator" label="Создатель" />
          <el-table-column prop="isPublished" label="Опубликован" />
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
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'
import type { orderEntity } from '../../../interfaces/orderEntity'
import orderService from '../../../services/orderService'
import type CourseEntity from '../../../interfaces/courseEntity'
import courseService from '../../../services/courseService'

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

function formatDate(date: string | Date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const roleLabel = computed(() => {
  if (student.value.role === 1) return 'Ученик'
  if (student.value.role === 2) return 'Учитель'
  return 'Неизвестно'
})

const statusText = (status: number) => {
switch (status) {
    case 0: return 'Ожидание'
    case 1: return 'Подтвержден'
    case 2: return 'Оплачен'
    case 3: return 'Отменен'
    default: return 'Неизвестно'
  }
}

const orders = ref<orderEntity[]>([])
const courses = ref<CourseEntity[]>([])
const enrollments = ref([])
const activeTab = ref('profile')
const isBlocked = ref(false)
const newPassword = ref('')
const id = ref('')

const phoneRegex = /^\+375(17|25|29|33|44)\d{7}$/
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  id.value = String(route.params.id)
  const user = await authService.getUser(id.value)
  if (user) {
    student.value = user
  }
  orders.value = await orderService.getUserOrders(id.value)
  courses.value = await courseService.getUserCourses(id.value)
  loading.close()
})

const updatePhone = async () => {
  if (!phoneRegex.test(student.value.phone)) {
    ElMessage.error('Неверный формат номера телефона!')
    return
  }

  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    await authService.editPhone(id.value, student.value.phone)
    ElMessage.success('Телефон успешно обновлён!')
  } catch (error) {
    ElMessage.error('Ошибка при обновлении телефона')
    console.log(error)
  } finally {
    loading.close()
  }
}

const updateEmail = async () => {
  if (!emailRegex.test(student.value.email)) {
    ElMessage.error('Неверный формат email!')
    return
  }

  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    await authService.editEmail(id.value, student.value.email)
    ElMessage.success('Email успешно обновлён!')
  } catch (error) {
    ElMessage.error('Ошибка при обновлении email')
    console.log(error)
  } finally {
    loading.close()
  }
}

async function deleteAccount() {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этот аккаунт?',
      'Подтверждение',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    )

    const loading = ElLoading.service({ text: 'Загрузка...' })

    await authService.deleteUser(student.value.userId)
    router.push('/admin/users/studentList')
    ElMessage.success('Аккаунт успешно удалён!')
    loading.close()
  }

const toggleBlock = async (userId: string) => {
  isBlocked.value = !isBlocked.value
  try {
    if (isBlocked.value) {
      await authService.setUserBlackList(userId)
      ElMessage.success('Пользователь добавлен в чёрный список')
    } else {
      await authService.cancelUserBlackList(userId)
      ElMessage.success('Пользователь исключён из чёрного списка')
    }
  } catch (error) {
    ElMessage.error('Ошибка при изменении статуса пользователя')
    console.error(error)
    isBlocked.value = !isBlocked.value
  }
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
