import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import TaskList from '@/views/tasks/TaskList.vue'
import TaskCreate from '@/views/tasks/TaskCreate.vue'
import TaskEdit from '@/views/tasks/TaskEdit.vue'
import TaskShow from '@/views/tasks/TaskShow.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tasks',
    name: 'TaskList',
    component: TaskList
  },
  {
    path: '/tasks/create',
    name: 'TaskCreate',
    component: TaskCreate
  },
  {
    path: '/tasks/:id',
    name: 'TaskShow',
    component: TaskShow,
    props: true
  },
  {
    path: '/tasks/:id/edit',
    name: 'TaskEdit',
    component: TaskEdit,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
