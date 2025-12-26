<template>
  <div class="form-container">
    <h2>Редактировать услугу</h2>

      <el-form :model="service" :rules="rules" ref="formRef" label-width="140px">
        <el-form-item label="ID услуги">
          <el-input v-model="service.serviceId" disabled />
        </el-form-item>

        <el-form-item label="Название услуги" prop="name">
          <el-input v-model="service.name" />
        </el-form-item>

        <el-form-item label="Цена (BYN)" prop="price">
          <el-input-number v-model="service.price" :min="1" :step="0.01" />
        </el-form-item>

        <el-form-item>
          <div style="text-align:center">
            <el-button type="primary" @click="submitForm">Сохранить</el-button>
            <el-button @click="resetForm">Сбросить</el-button>
            <el-button type="danger" @click="cancelEdit">Отмена</el-button>
          </div>
        </el-form-item>
      </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import type { FormInstance } from 'element-plus'
import serviceService from '../../../../services/serviceService'
import type createServiceDto from '../../../../dto/createServiceDto'

const route = useRoute()
const formRef = ref<FormInstance>()

// ref без .value в шаблоне
const service = ref<createServiceDto>({
  serviceId: '',
  name: '',
  price: 0
})

const rules = {
  name: [{ required: true, message: 'Название обязательно', trigger: 'blur' }],
  price: [{ required: true, message: 'Цена обязательна', trigger: 'blur' }]
}

onMounted(async () => {
  const loading = ElLoading.service({ text: 'Загрузка услуги...' })
  try {
    const id = route.params.id as string
    const data = await serviceService.getService(id)
    service.value = data
  } catch (error) {
    ElMessage.error('Не удалось загрузить услугу')
    console.error(error)
  } finally {
    loading.close()
  }
})

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      const loading = ElLoading.service({ text: 'Сохраняем изменения...' })
      try {
        await serviceService.updateService(service.value)
        ElMessage.success('Услуга обновлена')
        history.back()
      } catch (error) {
        ElMessage.error('Ошибка при сохранении')
        console.error(error)
      } finally {
        loading.close()
      }
    }
  })
}

const resetForm = () => {
  if (formRef.value) formRef.value.resetFields()
}

const cancelEdit = () => {
  history.back()
}
</script>

<style scoped>
.form-container {
  max-width: 650px;
  margin: 40px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}
</style>
