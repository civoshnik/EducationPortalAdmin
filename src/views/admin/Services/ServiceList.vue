<template>
  <div>
    <h2 align="center">Список услуг</h2>
    <div style="margin: 20px 0; text-align: right;">
      <el-button type="default" @click="$router.push('/admin/services/create')">
        Добавить услугу
      </el-button>
    </div>

    <el-table :data="services" style="width: 100%">
      <el-table-column prop="name" label="Название" />
      <el-table-column prop="price" label="Цена (BYN)" />
      <el-table-column label="Создан">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Изменён">
        <template #default="{ row }">
          {{ formatDate(row.modifiedAt) }}
        </template>
      </el-table-column>
      <el-table-column label="Действие" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="openService(row.serviceId)">
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
import serviceService from '../../../../services/serviceService'
import type ServiceEntity from '../../../../interfaces/serviceEntity'
import { ElLoading } from 'element-plus'
import router from '@/router'

const services = ref<ServiceEntity[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function formatDate(date: string | Date) {
  if (!date) return ''
  return new Date(date).toLocaleString('ru-RU')
}

const fetchServices = async () => {
  const loading = ElLoading.service({ text: 'Загрузка...' })
  try {
    const result = await serviceService.getPagedServices(page.value, pageSize.value)
    services.value = result.items || []
    total.value = result.totalCount || 0
  } catch (error) {
    console.error('Ошибка загрузки услуг:', error)
    services.value = []
    total.value = 0
  } finally {
    loading.close()
  }
}

const openService = async (serviceId: string) => {
  await router.push(`/admin/services/${serviceId}`)
}

const handlePageChange = (newPage: number) => {
  page.value = newPage
  fetchServices()
}

onMounted(fetchServices)
</script>
