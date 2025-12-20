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
import CourseDetails from '@/views/admin/CourseDetails.vue'
import EditCourse from '@/views/admin/EditCourse.vue'
import LessonDetails from '@/views/admin/LessonDetails.vue'
import LessonCreate from '@/views/admin/LessonCreate.vue'
import LessonEdit from '@/views/admin/LessonEdit.vue'
import Orderslist from '@/views/admin/Orders/Orderslist.vue'
import ServiceList from '../views/admin/Services/ServiceList.vue'
import AddService from '../views/admin/Services/AddService.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
  path: '/admin',
  component: HomeView,
  children: [
    { path: '/', component: AdminDashboard },
    { path: 'users/studentList', component: StudentList },
    { path: 'users/:id', component: StudentDetails },
    { path: 'users/teacherList', component: TeachersList },
    { path: 'courseList', component: CourseList },
    { path: 'lessonList', component: LessonList },
    { path: 'lessons/details/:id', component: LessonDetails },
    { path: 'lessons/create', component: LessonCreate },
    { path: 'lessons/edit/:id', component: LessonEdit },
    { path: 'questionList', component: QuestionList },
    { path: 'courses/create', component: CreateCourse },
    { path: 'courses/:id', component: CourseDetails },
    { path: 'courses/edit/:id', component: EditCourse },
    { path: 'ordersList', component: Orderslist },
    { path: 'testList', component: TestList },
    { path: 'serviceList', component: ServiceList },
    { path: 'services/create', component: AddService },
    { path: 'settings', component: AdminSettings }
  ]
}

  ],
})

export default router
