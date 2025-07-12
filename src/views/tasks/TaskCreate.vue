<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <router-link to="/tasks" class="text-gray-400 hover:text-gray-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900">Create New Task</h1>
    </div>

    <!-- Form Card -->
    <div class="card p-8">
      <form @submit.prevent="createTask" class="space-y-6">
        <!-- Title -->
        <div>
          <label for="title" class="form-label">Task Title *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-input"
            :class="{ 'border-red-500': errors.title }"
            placeholder="Enter task title"
            required
          />
          <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
        </div>

        <!-- Description -->
        <div>
          <label for="description" class="form-label">Description *</label>
          <textarea
            id="description"
            v-model="form.description"
            rows="4"
            class="form-input"
            :class="{ 'border-red-500': errors.description }"
            placeholder="Describe the task in detail"
            required
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
        </div>

        <!-- Status and Priority Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Status -->
          <div>
            <label for="status" class="form-label">Status</label>
            <select
              id="status"
              v-model="form.status"
              class="form-input"
              :class="{ 'border-red-500': errors.status }"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
          </div>

          <!-- Priority -->
          <div>
            <label for="priority" class="form-label">Priority</label>
            <select
              id="priority"
              v-model="form.priority"
              class="form-input"
              :class="{ 'border-red-500': errors.priority }"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <p v-if="errors.priority" class="mt-1 text-sm text-red-600">{{ errors.priority }}</p>
          </div>
        </div>

        <!-- Due Date -->
        <div>
          <label for="due_date" class="form-label">Due Date</label>
          <input
            id="due_date"
            v-model="form.due_date"
            type="datetime-local"
            class="form-input"
            :class="{ 'border-red-500': errors.due_date }"
          />
          <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">{{ errors.due_date }}</p>
          <p class="mt-1 text-sm text-gray-500">Optional: Set a due date and time for this task</p>
        </div>

        <!-- Error Message -->
        <div v-if="taskStore.error" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error creating task</h3>
              <p class="mt-1 text-sm text-red-700">{{ taskStore.error }}</p>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <router-link to="/tasks" class="btn btn-secondary">
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="taskStore.loading || !isFormValid"
          >
            <svg v-if="taskStore.loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ taskStore.loading ? 'Creating...' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Preview Card -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Task Preview</h3>
      <div class="space-y-3">
        <div class="flex justify-between items-start">
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="{
                'bg-yellow-400': form.status === 'pending',
                'bg-orange-400': form.status === 'in_progress',
                'bg-green-400': form.status === 'completed'
              }"
            ></div>
            <span 
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-red-100 text-red-800': form.priority === 'high',
                'bg-yellow-100 text-yellow-800': form.priority === 'medium',
                'bg-green-100 text-green-800': form.priority === 'low'
              }"
            >
              {{ form.priority }}
            </span>
          </div>
        </div>
        
        <div>
          <h4 class="font-medium text-gray-900">{{ form.title || 'Task Title' }}</h4>
          <p class="text-gray-600 text-sm mt-1">{{ form.description || 'Task description will appear here' }}</p>
        </div>
        
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span class="capitalize">{{ form.status.replace('_', ' ') }}</span>
          <span v-if="form.due_date">Due: {{ formatDate(form.due_date) }}</span>
          <span v-else>No due date</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import type { CreateTaskData, TaskStatus, TaskPriority } from '@/types/task'

const router = useRouter()
const taskStore = useTaskStore()

// Form state
const form = ref<CreateTaskData>({
  title: '',
  description: '',
  status: 'pending' as TaskStatus,
  priority: 'medium' as TaskPriority,
  due_date: null
})

// Form errors
const errors = ref<Record<string, string>>({})

// Computed
const isFormValid = computed(() => {
  return form.value.title.trim() && form.value.description.trim()
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.title.trim()) {
    errors.value.title = 'Task title is required'
  }
  
  if (!form.value.description.trim()) {
    errors.value.description = 'Task description is required'
  }
  
  if (form.value.due_date) {
    const dueDate = new Date(form.value.due_date)
    const now = new Date()
    if (dueDate < now) {
      errors.value.due_date = 'Due date cannot be in the past'
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const createTask = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    taskStore.clearError()
    await taskStore.createTask(form.value)
    router.push('/tasks')
  } catch (error) {
    console.error('Failed to create task:', error)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  taskStore.clearError()
})
</script>
