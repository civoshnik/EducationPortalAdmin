<template>
  <div class="admin-layout">
    <!-- Боковая навигация -->
    <el-menu
      default-active="dashboard"
      class="sidebar"
      background-color="#ffffff"
      text-color="#333"
      active-text-color="#409EFF"
      router>

      <el-sub-menu index="users">
        <template #title>
          <i class="el-icon-user"></i>
          <span>Пользователи</span>
        </template>
        <el-menu-item index="/admin/users/studentList">Список учеников</el-menu-item>
        <el-menu-item index="/admin/users/teacherList">Список учителей</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="courses">
        <template #title>
          <i class="el-icon-notebook-2"></i>
          <span>Курсы</span>
        </template>
        <el-menu-item index="/admin/courseList">Список курсов</el-menu-item>
        <el-menu-item index="/admin/lessonList">Список уроков</el-menu-item>
        <el-menu-item index="/admin/questionList">Список вопросов</el-menu-item>
        <el-menu-item index="/admin/courses/create">Добавить курс</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="orders">
        <template #title>
          <i class="el-icon-test"></i>
          <span>Заказы</span>
        </template>
        <el-menu-item index="/admin/testList">Список тестов</el-menu-item>
        <el-menu-item index="/admin/answersList">Ответы учеников</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="services">
        <template #title>
          <i class="el-icon-test"></i>
          <span>Услуги</span>
        </template>
        <el-menu-item index="/admin/testList">Список тестов</el-menu-item>
        <el-menu-item index="/admin/answersList">Ответы учеников</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="tests">
        <template #title>
          <i class="el-icon-test"></i>
          <span>Тесты</span>
        </template>
        <el-menu-item index="/admin/testList">Список тестов</el-menu-item>
        <el-menu-item index="/admin/answersList">Ответы учеников</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/admin/settings">
        <i class="el-icon-setting"></i>
        <span>Настройки</span>
      </el-menu-item>
    </el-menu>

    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh; /* растягиваем на весь экран */
  overflow: hidden;
  width: 100vw;
}

.sidebar {
  width: 240px;
  height: 100%;
  border-right: 1px solid #eee;
}

.main-content {
  flex-grow: 1; /* занимает всё оставшееся пространство */
  padding: 24px;
  overflow-y: auto;
  background: #f9f9f9;
}

</style>
