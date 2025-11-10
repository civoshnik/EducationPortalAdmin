<script setup lang="ts">
import Login from './views/Login.vue'
</script>

<template>
  <div class="layout">
    <!-- Хедер -->
    <header class="header">
      <div class="header-content">
        <div class="logo-block">
          <img src="@/assets/logo.svg" alt="Логотип" class="logo" />
        </div>
        <nav class="nav">
        </nav>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="main">
      <router-view/>
    </main>

    <!-- Футер -->
    <footer class="footer">
      <div class="footer-content">
        <p>© 2025 MyPortal. Все права защищены.</p>
        <p>Контакты: support@myportal.com | +375 (29) 123‑45‑67</p>
        <nav class="footer-links">
          <a href="#">О нас</a> | 
          <a href="#">Политика конфиденциальности</a> | 
          <a href="#">Помощь</a>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style>
/* Глобальный фон */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background: rgb(241, 240, 240)
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

/* Хедер */
.header {
  position: fixed;       /* фиксируем */
  top: 0;                /* прижимаем к верху */
  left: 0;
  width: 100%;           /* на всю ширину */
  z-index: 1000;         /* чтобы был поверх контента */
  background: #252525;
  border-bottom: 1px solid #ddd;
  padding: 12px 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* логотип слева, навигация справа */
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.site-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.btn {
  width: 100%;
  margin-top: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 14px rgba(102, 126, 234, 0.4);
}

/* Основной блок */
.main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  /* добавляем отступ сверху, равный высоте хедера */
  margin-top: 64px; /* подгони под реальную высоту */
}

/* Футер */
.footer {
  background: #2c2c2c; /* тёмно‑серый */
  color: #eee;
  padding: 25px;
  font-size: 14px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.footer-links a {
  color: #eee;
  text-decoration: none;
  margin: 0 5px;
}

.footer-links a:hover {
  text-decoration: underline;
}
</style>
