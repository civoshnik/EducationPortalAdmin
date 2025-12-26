<template>
  <div>
    <h2 align="center">Список заказов</h2>
    <el-button type="success" style="margin-bottom: 15px;" @click="exportOrders">
    Экспорт в Excel
    </el-button>
    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="orderId" label="ID заказа" width="250" />
      <el-table-column prop="totalPrice" label="Сумма" />
      <el-table-column prop="status" label="Статус">
        <template #default="{ row }">
          <el-tag
  :type="row.status === 1 ? 'success' 
        : row.status === 2 ? 'warning' 
        : row.status === 3 ? 'danger' 
        : 'info'">
  {{ mapStatus(row.status) }}
</el-tag>

        </template>
      </el-table-column>
      <el-table-column label="Создан">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openOrder(row.orderId)">
            Открыть
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="page"
      @current-change="handlePageChange"
      style="margin-top: 20px; text-align: center;"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import orderService from '../../../../services/orderService'
import type { OrderEntity } from '../../../../interfaces/orderEntity'
import { ElLoading } from 'element-plus'
import router from '@/router'
import axios from 'axios'

async function exportOrders() {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  const response = await axios.get('/order/export', { responseType: 'blob' })
  const blob = new Blob([response.data], { type: response.headers['content-type'] })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'orders.xlsx'
  link.click()
  loading.close()
}

const orders = ref<OrderEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

function mapStatus(status: number) {
  switch (status) {
    case 0: return 'В ожидании'
    case 1: return 'Подтверждён'
    case 2: return 'Оплачен'
    case 3: return 'Отменён'
    default: return status.toString()
  }
}




const fetchOrders = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    const result = await orderService.getPagedOrders(page.value, pageSize.value)
    orders.value = result.items || []
    total.value = result.totalCount || 0
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
    orders.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const openOrder = async (orderId: string) => {
  await router.push(`/admin/orders/details/${orderId}`)
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchOrders()
}

onMounted(fetchOrders)
</script>
