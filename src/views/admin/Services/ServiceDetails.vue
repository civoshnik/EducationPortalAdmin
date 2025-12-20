<template>
  <div class="service-details">
    <h2>Информация об услуге</h2>
    <el-button
      type="default"
      class="back-btn"
      @click="$router.push('/admin/serviceList')"
    >
      ← Назад к списку услуг
    </el-button>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="Профиль" name="profile">
        <fieldset class="profile-fieldset">
          <legend>Данные услуги</legend>
          <div class="profile-grid">
            <div class="profile-row">
              <label class="label-text">Название:</label>
              <div class="value">{{ service.name }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Цена (BYN):</label>
              <div class="value">{{ service.price }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Создан:</label>
              <div class="value">{{ formatDate(service.createdAt) }}</div>
            </div>
            <div class="profile-row" v-if="service.modifiedAt">
              <label class="label-text">Изменён:</label>
              <div class="value">{{ formatDate(service.modifiedAt) }}</div>
            </div>
            <div class="profile-actions">
              <el-button 
                type="primary" 
                size="large" 
                @click="router.push(`/admin/services/edit/${service.serviceId}`)">
                Редактировать
              </el-button>
              <el-button type="danger" size="large" @click="deleteService">Удалить услугу</el-button>
            </div>
          </div>
        </fieldset>
      </el-tab-pane>

      <el-tab-pane label="Заказы" name="orders">
        <el-table :data="orders" height="600" stripe>
          <el-table-column prop="orderId" label="ID заказа" />
          <el-table-column prop="userId" label="Пользователь" />
          <el-table-column prop="quantity" label="Количество" />
          <el-table-column prop="price" label="Цена" />
          <el-table-column prop="createdAt" label="Дата заказа" />
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
import type ServiceEntity from '../../../../interfaces/serviceEntity'
import serviceService from '../../../../services/serviceService'
import orderService from '../../../../services/orderService'

const route = useRoute()

const service = ref<ServiceEntity>({
  serviceId: '',
  name: '',
  price: 0,
  createdAt: new Date(),
  modifiedAt: undefined
})

const orders = ref<any[]>([])
const activeTab = ref('profile')

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  const id = route.params.id as string
  const data = await serviceService.getService(id)
  if (data) {
    service.value = data
  }
  orders.value = await orderService.getOrdersByService(id)
  loading.close()
})

function formatDate(date: Date | string | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

async function deleteService() {
  await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить эту услугу?',
      'Подтверждение',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
      }
    )
  const loading = ElLoading.service({ text: 'Удаление...' })
  await serviceService.deleteService(service.value.serviceId)
  router.push('/admin/serviceList')
  ElMessage.success('Услуга успешно удалена!')
  loading.close()
}
</script>

<style scoped>
.service-details {
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
  margin-bottom: 20px;
}

.profile-fieldset {
  display: inline-block;
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
