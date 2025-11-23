import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import StudentList from '@/views/admin/StudentList.vue'
import CreateCourse from '@/views/admin/CreateCourse.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import TeachersList from '@/views/admin/TeachersList.vue'
import CourseList from '@/views/admin/CourseList.vue'
import LessonList from '@/views/admin/LessonList.vue'
import QuestionList from '@/views/admin/QuestionList.vue'
import StudentDetails from '@/views/admin/StudentDetails.vue'
import TestList from '../views/admin/TestList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
  path: '/admin',
  component: HomeView,
  children: [
    { path: 'dashboard', component: AdminDashboard },
    { path: 'users/studentList', component: StudentList },
    { path: 'users/studentList/:id', component: StudentDetails },
    { path: 'users/teacherList', component: TeachersList },
    { path: 'courseList', component: CourseList },
    { path: 'lessonList', component: LessonList },
    { path: 'questionList', component: QuestionList },
    { path: 'courses/create', component: CreateCourse },
    { path: 'testList', component: TestList },
    { path: 'settings', component: AdminSettings }
  ]
}

  ],
})

export default router
