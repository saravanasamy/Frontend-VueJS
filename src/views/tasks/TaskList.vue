<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Tasks</h1>
        <p class="text-gray-600 mt-1">Manage and track all your tasks</p>
      </div>
      <router-link to="/tasks/create" class="btn btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        New Task
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select 
            v-model="filters.status" 
            class="form-input w-48"
            @change="applyFilters"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select 
            v-model="filters.priority" 
            class="form-input w-48"
            @change="applyFilters"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input 
            v-model="filters.search" 
            type="text" 
            placeholder="Search tasks..."
            class="form-input w-64"
            @input="applyFilters"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="taskStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="taskStore.error" class="card p-6 text-center">
      <div class="text-red-600 mb-4">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Tasks</h3>
      <p class="text-gray-600 mb-4">{{ taskStore.error }}</p>
      <button @click="taskStore.fetchTasks()" class="btn btn-primary">
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredTasks.length === 0" class="card p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
      <p class="mt-2 text-gray-600">
        {{ filters.status || filters.priority || filters.search ? 'No tasks match your current filters.' : 'Get started by creating your first task.' }}
      </p>
      <div class="mt-6 space-x-3">
        <router-link to="/tasks/create" class="btn btn-primary">
          Create Task
        </router-link>
        <button 
          v-if="filters.status || filters.priority || filters.search"
          @click="clearFilters" 
          class="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Tasks Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="task in filteredTasks" 
        :key="task.id"
        class="card p-6 hover:shadow-lg transition-shadow duration-200"
      >
        <!-- Task Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center space-x-2">
            <div 
              class="w-3 h-3 rounded-full"
              :class="{
                'bg-yellow-400': task.status === 'pending',
                'bg-orange-400': task.status === 'in_progress',
                'bg-green-400': task.status === 'completed'
              }"
            ></div>
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
          </div>
          
          <!-- Actions Dropdown -->
          <div class="relative">
            <button 
              @click="toggleDropdown(task.id)"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
              </svg>
            </button>
            
            <div 
              v-show="dropdownOpen === task.id"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              @click.stop
            >
              <router-link 
                :to="`/tasks/${task.id}`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeDropdown"
              >
                View Details
              </router-link>
              <router-link 
                :to="`/tasks/${task.id}/edit`"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                @click="closeDropdown"
              >
                Edit Task
              </router-link>
              <button 
                @click="confirmDelete(task)"
                class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>

        <!-- Task Content -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ task.title }}</h3>
          <p class="text-gray-600 text-sm line-clamp-3">{{ task.description }}</p>
        </div>

        <!-- Task Footer -->
        <div class="flex justify-between items-center text-sm text-gray-500">
          <span class="capitalize">{{ task.status.replace('_', ' ') }}</span>
          <span v-if="task.due_date">Due: {{ formatDate(task.due_date) }}</span>
          <span v-else>No due date</span>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="cancelDelete"
    >
      <div class="bg-white rounded-lg p-6 max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Delete Task</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete "{{ taskToDelete?.title }}"? This action cannot be undone.
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Task } from '@/types/task'

const taskStore = useTaskStore()

// State
const filters = ref({
  status: '',
  priority: '',
  search: ''
})

const dropdownOpen = ref<number | null>(null)
const showDeleteModal = ref(false)
const taskToDelete = ref<Task | null>(null)
const deleting = ref(false)

// Computed
const filteredTasks = computed(() => {
  let tasks = [...taskStore.tasks]
  
  if (filters.value.status) {
    tasks = tasks.filter(task => task.status === filters.value.status)
  }
  
  if (filters.value.priority) {
    tasks = tasks.filter(task => task.priority === filters.value.priority)
  }
  
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(search) || 
      task.description.toLowerCase().includes(search)
    )
  }
  
  return tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})

// Methods
const applyFilters = () => {
  // Filters are reactive, so this is just for explicit calls
}

const clearFilters = () => {
  filters.value = {
    status: '',
    priority: '',
    search: ''
  }
}

const toggleDropdown = (taskId: number) => {
  dropdownOpen.value = dropdownOpen.value === taskId ? null : taskId
}

const closeDropdown = () => {
  dropdownOpen.value = null
}

const confirmDelete = (task: Task) => {
  taskToDelete.value = task
  showDeleteModal.value = true
  closeDropdown()
}

const cancelDelete = () => {
  showDeleteModal.value = false
  taskToDelete.value = null
}

const deleteTask = async () => {
  if (!taskToDelete.value) return
  
  deleting.value = true
  try {
    await taskStore.deleteTask(taskToDelete.value.id)
    showDeleteModal.value = false
    taskToDelete.value = null
  } catch (error) {
    console.error('Failed to delete task:', error)
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  if (dropdownOpen.value !== null) {
    closeDropdown()
  }
}

onMounted(() => {
  taskStore.fetchTasks()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
