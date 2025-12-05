<template>
  <div>
    <h2 align="center">Список заказов</h2>

    <el-table :data="orders" style="width: 100%">
      <el-table-column prop="orderId" label="ID заказа" width="250" />
      <el-table-column prop="totalPrice" label="Сумма" />
      <el-table-column prop="status" label="Статус">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 'Confirmed' ? 'success' 
                  : row.status === 'Paid' ? 'warning' 
                  : row.status === 'Cancelled' ? 'danger' 
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
import type { orderEntity } from '../../../../interfaces/orderEntity'
import { ElLoading } from 'element-plus'
import router from '@/router'

const orders = ref<orderEntity[]>([])
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

function mapStatus(status: string) {
  switch (status) {
    case 'Draft': return 'Черновик'
    case 'Confirmed': return 'Подтверждён'
    case 'Paid': return 'Оплачен'
    case 'Cancelled': return 'Отменён'
    default: return status
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
  await router.push(`/admin/orders/${orderId}`)
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchOrders()
}

onMounted(fetchOrders)
</script>
