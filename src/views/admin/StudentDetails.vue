<template>
  <div class="student-details">
    <h2>Информация о студенте</h2>
    <el-button type="default" @click="$router.push('/admin/users/studentList')">
    ← Назад
    </el-button>
    <el-tabs v-model="activeTab">
      <!-- 🧍 Профиль -->
      <el-tab-pane label="Профиль" name="profile">
  <el-card shadow="hover" class="profile-card">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="Имя">{{ student?.firstName }}</el-descriptions-item>
      <el-descriptions-item label="Фамилия">{{ student?.lastName }}</el-descriptions-item>
      <el-descriptions-item label="Телефон">{{ student?.phone }}</el-descriptions-item>
      <el-descriptions-item label="Email">{{ student?.email }}</el-descriptions-item>
      <el-descriptions-item label="Роль">{{ student?.role }}</el-descriptions-item>
      <el-descriptions-item label="UserId">{{ student?.userId }}</el-descriptions-item>
    </el-descriptions>

    <!-- 🔧 Блок действий -->
    <div class="action-buttons">
      <el-button type="primary">Сменить Email</el-button>
      <el-button type="warning" >Сбросить пароль</el-button>
      <el-button type="danger" >Удалить аккаунт</el-button>
      <el-button type="info">
        {{ isBlocked ? 'Разблокировать' : 'Заблокировать' }}
      </el-button>
      <el-button type="success">Отправить уведомление</el-button>
    </div>
  </el-card>
</el-tab-pane>


      <!-- 📦 Заказы -->
      <el-tab-pane label="Заказы" name="orders">
        <el-table :data="orders" style="width: 100%">
          <el-table-column prop="orderId" label="ID заказа" />
          <el-table-column prop="totalPrice" label="Сумма" />
          <el-table-column prop="status" label="Статус" />
          <el-table-column prop="createdAt" label="Создан" />
        </el-table>
      </el-tab-pane>

      <!-- 🎓 Курсы -->
      <el-tab-pane label="Курсы" name="courses">
        <el-table :data="enrollments" style="width: 100%">
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import authService from '../../../services/authService'
// import orderService from '../../../services/orderService'
// import enrollmentService from '../../../services/enrollmentService'
import type UserEntity from '../../../interfaces/userEntity'
import { ElLoading } from 'element-plus';

const route = useRoute()
const student = ref<UserEntity | null>(null)
const orders = ref([])
const enrollments = ref([])
const activeTab = ref('profile')

const isBlocked = ref();

onMounted(async () => {
    const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Загружаем студента...',
    background: 'rgba(0, 0, 0, 0.4)',
    spinner: 'el-icon-loading',
  })
  const id = route.params.id as string
  student.value = await authService.getUser(id)
  // orders.value = await orderService.getOrdersByUser(id)
  // enrollments.value = await enrollmentService.getEnrollmentsByUser(id)
  loadingInstance.close()
})

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
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  text-align: left;
}

.profile-card {
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.el-tabs {
  margin-top: 20px;
}
</style>
