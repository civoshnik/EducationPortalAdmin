<template>
  <div class="admin-layout">
    <!-- Боковая навигация -->
    <el-menu
      default-active="dashboard"
      class="sidebar"
      background-color="#ffffff"
      text-color="#333"
      active-text-color="#409EFF"
      router
      unique-opened
    >
      <el-sub-menu index="users">
        <template #title>
          <span>Пользователи</span>
        </template>
        <el-menu-item index="/admin/users/studentList">Список учеников</el-menu-item>
        <el-menu-item index="/admin/users/adminList">Список администраторов</el-menu-item>
        <el-menu-item index="/admin/users/blackList">Черный список</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="courses">
        <template #title>
          <span>Курсы</span>
        </template>
        <el-menu-item index="/admin/courseList">Список курсов</el-menu-item>
        <el-menu-item index="/admin/lessonList">Список уроков</el-menu-item>
        <el-menu-item index="/admin/questionList">Список вопросов</el-menu-item>
        <el-menu-item index="/admin/testList">Список тестов</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="orders">
        <template #title>
          <span>Заказы</span>
        </template>
        <el-menu-item index="/admin/ordersList">Список заказов</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="services">
        <template #title>
          <span>Услуги</span>
        </template>
        <el-menu-item index="/admin/serviceList">Список услуг</el-menu-item>
      </el-sub-menu>
    </el-menu>

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
}

/* Сайдбар */
.sidebar {
  width: 240px;
  height: 100%;
  border-right: 1px solid #eee;
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

/* Элементы меню */
.sidebar .el-menu-item,
.sidebar .el-sub-menu__title {
  transition: all 0.3s ease;
  border-radius: 6px;
  margin: 4px 8px;
  padding: 12px;
}

/* Hover эффект */
.sidebar .el-menu-item:hover,
.sidebar .el-sub-menu__title:hover {
  background: linear-gradient(90deg, #f0f9ff, #e6f7ff);
  transform: translateX(5px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Анимация раскрытия */
.sidebar .el-sub-menu__title {
  position: relative;
}
.sidebar .el-sub-menu__title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background: #409EFF;
  transition: width 0.3s ease;
}
.sidebar .el-sub-menu__title:hover::after {
  width: 100%;
}

/* Основной контент */
.main-content {
  flex-grow: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f9f9f9;
  transition: background 0.5s ease;
}
.main-content:hover {
  background: #fdfdfd;
}
</style>
