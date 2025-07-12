<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Task Manager Dashboard</h1>
      <p class="text-gray-600">Manage your tasks efficiently with our modern Vue.js interface</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Tasks</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStore.taskCount }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Pending</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStore.pendingTasks.length }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-orange-100">
            <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">In Progress</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStore.inProgressTasks.length }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Completed</p>
            <p class="text-2xl font-bold text-gray-900">{{ taskStore.completedTasks.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Tasks -->
    <div class="card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">Recent Tasks</h2>
        <router-link to="/tasks" class="text-primary-600 hover:text-primary-700 font-medium">
          View All
        </router-link>
      </div>

      <div v-if="taskStore.loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading tasks...</p>
      </div>

      <div v-else-if="recentTasks.length === 0" class="text-center py-8">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="mt-2 text-gray-600">No tasks found</p>
        <router-link to="/tasks/create" class="btn btn-primary mt-4">
          Create your first task
        </router-link>
      </div>

      <div v-else class="space-y-3">
        <div 
          v-for="task in recentTasks" 
          :key="task.id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-3 h-3 rounded-full"
              :class="{
                'bg-yellow-400': task.status === 'pending',
                'bg-orange-400': task.status === 'in_progress',
                'bg-green-400': task.status === 'completed'
              }"
            ></div>
            <div>
              <h3 class="font-medium text-gray-900">{{ task.title }}</h3>
              <p class="text-sm text-gray-600">{{ task.description }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-red-100 text-red-800': task.priority === 'high',
                'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                'bg-green-100 text-green-800': task.priority === 'low'
              }"
            >
              {{ task.priority }}
            </span>
            <router-link 
              :to="`/tasks/${task.id}`"
              class="text-primary-600 hover:text-primary-700"
            >
              View
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

// Get recent tasks (latest 5)
const recentTasks = computed(() => {
  return [...taskStore.tasks]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
})

onMounted(() => {
  taskStore.fetchTasks()
})
</script>
