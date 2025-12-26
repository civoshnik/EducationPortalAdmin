<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElLoading } from 'element-plus'
import orderService from '../../../../services/orderService'
import type { OrderEntity } from '../../../../interfaces/orderEntity'
import type ServiceEntity from '../../../../interfaces/serviceEntity'
import serviceService from '../../../../services/serviceService'

const serviceDialogVisible = ref(false)
const selectedService = ref<ServiceEntity | null>(null)

async function openServiceDialog(row: any) {
  serviceDialogVisible.value = true
  selectedService.value = await serviceService.getService(row.serviceId)
}

const route = useRoute()
const order = ref<OrderEntity | null>(null)
const activeTab = ref('profile')

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  const id = route.params.id as string
  order.value = await orderService.getOrderById(id)
  loading.close()
})

function formatDate(date: string | Date | null | undefined) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString()
}

</script>

<template>
  <div class="order-details">
    <h2>Информация о заказе</h2>
    <el-button type="default" class="back-btn" @click="$router.push('/admin/ordersList')">
      ← Назад к списку заказов
    </el-button>

    <el-tabs v-model="activeTab">
      <!-- Профиль -->
      <el-tab-pane label="Профиль" name="profile">
        <fieldset class="profile-fieldset">
          <legend>Данные заказа</legend>
          <div class="profile-grid">
            <div class="profile-row">
              <label class="label-text">ID:</label>
              <div class="value">{{ order?.orderId }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Пользователь:</label>
              <div class="value">{{ order?.userId }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Статус:</label>
              <div class="value">{{ order?.status }}</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Сумма:</label>
              <div class="value">{{ order?.totalPrice }} BYN</div>
            </div>
            <div class="profile-row">
              <label class="label-text">Создан:</label>
              <div class="value">{{ formatDate(order?.createdAt) }}</div>
            </div>
            <div class="profile-row" v-if="order?.modifiedAt">
              <label class="label-text">Изменён:</label>
              <div class="value">{{ formatDate(order?.modifiedAt) }}</div>
            </div>
          </div>
        </fieldset>
      </el-tab-pane>

      <!-- Услуги -->
      <el-tab-pane label="Услуги" name="services">
        <el-table :data="order?.services || []" height="600" stripe @row-click="openServiceDialog">
          <el-table-column prop="serviceId" label="ID услуги" />
          <el-table-column prop="quantity" label="Количество" />
          <el-table-column prop="totalPrice" label="Итого (BYN)" />
        </el-table>

        <el-dialog v-model="serviceDialogVisible" title="Информация об услуге" width="600px">
          <div v-if="selectedService">
            <p><strong>Название:</strong> {{ selectedService.name }}</p>
            <p><strong>Цена:</strong> {{ selectedService.price }} BYN</p>
            <p><strong>Создан:</strong> {{ formatDate(selectedService.createdAt) }}</p>
            <p v-if="selectedService.modifiedAt"><strong>Изменён:</strong> {{ formatDate(selectedService.modifiedAt) }}</p>
          </div>
          <template #footer>
            <el-button @click="serviceDialogVisible = false">Закрыть</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.order-details {
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
  padding: 8px 12px;
  background-color: #f9f9f9; 
  border-radius: 4px;
}

.label-text {
  font-weight: 600;
  font-size: 16px;
  width: 140px;
  color: #000;
}

.value {
  font-size: 16px;
  color: #000;
}

.el-table {
  font-size: 16px;
}
</style>
