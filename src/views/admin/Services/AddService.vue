<template>
  <div class="form-container">
    <el-card class="add-service-card">
      <h2 class="form-title">Добавить услугу</h2>
      <el-form :model="service" :rules="rules" ref="formRef" label-width="140px">
        
        <el-form-item label="Название услуги" prop="name">
          <el-input v-model="service.name" placeholder="Например: Индивидуальная консультация" />
        </el-form-item>

        <el-form-item label="Цена (BYN)" prop="price">
          <el-input-number v-model="service.price" :min="1" :step="0.01" />
        </el-form-item>

        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" @click="submitForm">💾 Сохранить</el-button>
            <el-button @click="resetForm">🔄 Сбросить</el-button>
            <el-button type="danger" @click="cancelAdd">❌ Отмена</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import serviceService from '../../../../services/serviceService'
import router from '@/router'

const formRef = ref<FormInstance>()
const service = ref({
  name: '',
  price: 0
})

const rules = {
  name: [{ required: true, message: 'Название обязательно', trigger: 'blur' }],
  price: [{ required: true, message: 'Цена обязательна', trigger: 'blur' }]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем услугу...' })
      try {
        await serviceService.createService(service.value)
        ElMessage.success('Услуга успешно добавлена')
        resetForm()
        await router.push('/admin/serviceList')
      } catch (error) {
        ElMessage.error('Ошибка при добавлении услуги')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const cancelAdd = async () => {
  await router.push('/admin/serviceList')
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
}
</script>

<style scoped>
.form-container {
  max-width: 650px;
  margin: 40px auto;
  padding: 20px;
}

.add-service-card {
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  background-color: #fff;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}
</style>
