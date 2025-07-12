<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="taskStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading task...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="taskStore.error" class="card p-6 text-center">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Task</h3>
      <p class="text-gray-600 mb-4">{{ taskStore.error }}</p>
      <div class="space-x-3">
        <button @click="loadTask" class="btn btn-primary">Try Again</button>
        <router-link to="/tasks" class="btn btn-secondary">Back to Tasks</router-link>
      </div>
    </div>

    <!-- Task Content -->
    <template v-else-if="task">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <router-link to="/tasks" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900">Task Details</h1>
        </div>
        
        <div class="flex space-x-3">
          <router-link :to="`/tasks/${task.id}/edit`" class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit
          </router-link>
          <button @click="confirmDelete" class="btn btn-danger">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <!-- Main Task Card -->
      <div class="card p-8">
        <!-- Task Header -->
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center space-x-3">
            <div 
              class="w-4 h-4 rounded-full"
              :class="{
                'bg-yellow-400': task.status === 'pending',
                'bg-orange-400': task.status === 'in_progress',
                'bg-green-400': task.status === 'completed'
              }"
            ></div>
            <span 
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="{
                'bg-red-100 text-red-800': task.priority === 'high',
                'bg-yellow-100 text-yellow-800': task.priority === 'medium',
                'bg-green-100 text-green-800': task.priority === 'low'
              }"
            >
              {{ task.priority }} priority
            </span>
            <span 
              class="px-3 py-1 text-sm font-medium rounded-full"
              :class="{
                'bg-yellow-100 text-yellow-800': task.status === 'pending',
                'bg-orange-100 text-orange-800': task.status === 'in_progress',
                'bg-green-100 text-green-800': task.status === 'completed'
              }"
            >
              {{ task.status.replace('_', ' ') }}
            </span>
          </div>
        </div>

        <!-- Task Title -->
        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ task.title }}</h2>

        <!-- Task Description -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <div class="prose prose-gray max-w-none">
            <p class="text-gray-700 whitespace-pre-wrap">{{ task.description }}</p>
          </div>
        </div>

        <!-- Task Metadata -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Status</h4>
            <p class="text-lg capitalize text-gray-900">{{ task.status.replace('_', ' ') }}</p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Priority</h4>
            <p class="text-lg capitalize text-gray-900">{{ task.priority }}</p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Due Date</h4>
            <p class="text-lg text-gray-900">
              {{ task.due_date ? formatDate(task.due_date) : 'No due date' }}
            </p>
          </div>
          
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Created</h4>
            <p class="text-lg text-gray-900">{{ formatDate(task.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="flex flex-wrap gap-3">
          <button 
            v-if="task.status !== 'in_progress'"
            @click="updateStatus('in_progress')"
            class="btn btn-secondary"
            :disabled="updating"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ updating ? 'Updating...' : 'Start Progress' }}
          </button>
          
          <button 
            v-if="task.status !== 'completed'"
            @click="updateStatus('completed')"
            class="btn btn-secondary"
            :disabled="updating"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ updating ? 'Updating...' : 'Mark Complete' }}
          </button>
          
          <button 
            v-if="task.status !== 'pending'"
            @click="updateStatus('pending')"
            class="btn btn-secondary"
            :disabled="updating"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ updating ? 'Updating...' : 'Reset to Pending' }}
          </button>
        </div>
      </div>
    </template>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div class="bg-white rounded-lg p-6 max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Task</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ task?.title }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="btn btn-secondary">Cancel</button>
          <button @click="deleteTask" class="btn btn-danger" :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import type { TaskStatus } from '@/types/task'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

// Props
const props = defineProps<{
  id: string
}>()

// State
const showDeleteModal = ref(false)
const deleting = ref(false)
const updating = ref(false)

// Computed
const task = computed(() => taskStore.currentTask)

// Methods
const loadTask = async () => {
  try {
    await taskStore.fetchTask(Number(props.id))
  } catch (error) {
    console.error('Failed to load task:', error)
  }
}

const updateStatus = async (status: TaskStatus) => {
  if (!task.value) return
  
  updating.value = true
  try {
    await taskStore.updateTask(task.value.id, { status })
  } catch (error) {
    console.error('Failed to update task status:', error)
  } finally {
    updating.value = false
  }
}

const confirmDelete = () => {
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
}

const deleteTask = async () => {
  if (!task.value) return
  
  deleting.value = true
  try {
    await taskStore.deleteTask(task.value.id)
    router.push('/tasks')
  } catch (error) {
    console.error('Failed to delete task:', error)
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadTask()
})
</script>
