import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus, TaskPriority } from '@/types/task'
import { taskApi } from '@/services/api'

export const useTaskStore = defineStore('task', () => {
  // State
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const taskCount = computed(() => tasks.value.length)
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.status === 'completed')
  )
  const pendingTasks = computed(() => 
    tasks.value.filter(task => task.status === 'pending')
  )
  const inProgressTasks = computed(() => 
    tasks.value.filter(task => task.status === 'in_progress')
  )

  // Actions
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await taskApi.getTasks()
      tasks.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  const fetchTask = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await taskApi.getTask(id)
      currentTask.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await taskApi.createTask(taskData)
      tasks.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to create task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, taskData: Partial<Task>) => {
    loading.value = true
    error.value = null
    try {
      const response = await taskApi.updateTask(id, taskData)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?.id === id) {
        currentTask.value = response.data
      }
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to update task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await taskApi.deleteTask(id)
      tasks.value = tasks.value.filter(task => task.id !== id)
      if (currentTask.value?.id === id) {
        currentTask.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to delete task'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    tasks,
    currentTask,
    loading,
    error,
    // Getters
    taskCount,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    // Actions
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    clearError
  }
})
