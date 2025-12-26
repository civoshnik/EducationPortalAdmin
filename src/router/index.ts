import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import StudentList from '@/views/admin/StudentList.vue'
import CreateCourse from '@/views/admin/CreateCourse.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import TeachersList from '@/views/admin/TeachersList.vue'
import CourseList from '@/views/admin/CourseList.vue'
import LessonList from '@/views/admin/LessonList.vue'
import QuestionList from '@/views/admin/Questions/QuestionList.vue'
import StudentDetails from '@/views/admin/StudentDetails.vue'
import TestList from '@/views/admin/Tests/TestList.vue'
import CourseDetails from '@/views/admin/CourseDetails.vue'
import EditCourse from '@/views/admin/EditCourse.vue'
import LessonDetails from '@/views/admin/LessonDetails.vue'
import LessonCreate from '@/views/admin/LessonCreate.vue'
import LessonEdit from '@/views/admin/LessonEdit.vue'
import Orderslist from '@/views/admin/Orders/Orderslist.vue'
import ServiceList from '../views/admin/Services/ServiceList.vue'
import AddService from '../views/admin/Services/AddService.vue'
import CreateTest from '@/views/admin/Tests/CreateTest.vue'
import CreateQuestion from '@/views/admin/Questions/CreateQuestion.vue'
import QuestionDetails from '@/views/admin/Questions/QuestionDetails.vue'
import TestDetails from '@/views/admin/Tests/TestDetails.vue'
import EditTest from '@/views/admin/Tests/EditTest.vue'
import EditQuestion from '@/views/admin/Questions/EditQuestion.vue'
import BlackList from '@/views/admin/BlackList.vue'
import AdminList from '@/views/admin/AdminList.vue'
import OrderDetails from '@/views/admin/Orders/OrderDetails.vue'
import ServiceDetails from '@/views/admin/Services/ServiceDetails.vue'
import EditService from '@/views/admin/Services/EditService.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
  path: '/admin',
  component: HomeView,
  children: [
    { path: '/', component: AdminDashboard },
    { path: 'users/studentList', component: StudentList },
    { path: 'users/adminList', component: AdminList },
    { path: 'users/blackList', component: BlackList },
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
    { path: 'settings', component: AdminSettings },
    { path: 'tests/create', component: CreateTest },
    { path: 'questions/create', component: CreateQuestion },
    { path: 'questions/details/:id', component: QuestionDetails },
    { path: 'tests/details/:id', component: TestDetails },
    { path: 'tests/edit/:id', component: EditTest },
    { path: 'questions/edit/:id', component: EditQuestion },
    { path: 'orders/details/:id', component: OrderDetails },
    { path: 'services/details/:id', component: ServiceDetails },
    { path: 'services/edit/:id', component: EditService },
  ]
}

  ],
})

export default router
