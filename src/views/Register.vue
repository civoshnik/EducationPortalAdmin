<template>
  <div class="auth-container">
    <el-card class="box-card">
      <h2 class="title">Регистрация</h2>
      <el-form :model="loginForm" @submit.prevent="handleRegister" label-position="top">
        <el-form-item label="Логин">
          <el-input v-model="loginForm.login" placeholder="Введите логин" clearable size="large" />
        </el-form-item>

        <el-form-item label="Имя">
          <el-input v-model="loginForm.firstName" placeholder="Введите имя" clearable size="large" />
        </el-form-item>

        <el-form-item label="Фамилия">
          <el-input v-model="loginForm.lastName" placeholder="Введите фамилию" clearable size="large" />
        </el-form-item>

        <el-form-item label="Телефон">
          <el-input v-model="loginForm.phone" placeholder="Введите телефон" clearable size="large" />
        </el-form-item>

        <el-form-item label="Email">
          <el-input v-model="loginForm.email" placeholder="Введите телефон" clearable size="large" />
        </el-form-item>

        <el-form-item label="Пароль">
          <el-input v-model="loginForm.password" type="password" placeholder="Введите пароль" show-password size="large" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="btn" size="large" @click="handleRegister">Зарегестрироваться</el-button>
        </el-form-item>

        <div class="divider">
          <span>или</span>
        </div>

        <el-form-item>
          <el-button class="btn-outline" size="large" @click="$router.push('/login')">Войти</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import authService from '../../services/authService'


const loginForm = reactive({
  login: '',
  password: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
})

const handleRegister = () => {
  authService.registerUser(loginForm);
}
</script>

<style scoped>
.auth-container {
  flex: 1; /* занимает всё свободное место между хедером и футером */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  background: #f0f0f0;
  box-sizing: border-box;
}

/* Карточка */
.box-card {
  width: 600px;
  padding: 40px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 35px rgba(0,0,0,0.25);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.6s ease;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-weight: 700;
  font-size: 28px;
  color: #333;
}

/* Анимация */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Поля ввода */
.el-input {
  border-radius: 10px;
  transition: all 0.3s ease;
}
.el-input:hover {
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.4);
}
.el-input:focus-within {
  box-shadow: 0 0 14px rgba(118, 75, 162, 0.6);
}

/* Основная кнопка */
.btn {
  width: 100%;
  margin-top: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(102, 126, 234, 0.4);
}

/* Outline‑кнопка */
.btn-outline {
  width: 100%;
  margin-top: 15px;
  border: 2px solid #aaa;
  background: transparent;
  color: #333;
  transition: all 0.3s ease;
}
.btn-outline:hover {
  border-color: #667eea;
  color: #667eea;
}

/* Разделитель */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #666;
  font-weight: 500;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ccc;
}
.divider:not(:empty)::before {
  margin-right: 0.75em;
}
.divider:not(:empty)::after {
  margin-left: 0.75em;
}
</style>
