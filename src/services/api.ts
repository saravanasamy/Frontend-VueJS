import axios from 'axios'
import type { Task, CreateTaskData, UpdateTaskData, ApiResponse, PaginatedResponse } from '@/types/task'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Task API endpoints
export const taskApi = {
  // Get all tasks
  getTasks: (): Promise<ApiResponse<Task[]>> => {
    return api.get('/tasks')
  },

  // Get single task
  getTask: (id: number): Promise<ApiResponse<Task>> => {
    return api.get(`/tasks/${id}`)
  },

  // Create new task
  createTask: (data: CreateTaskData): Promise<ApiResponse<Task>> => {
    return api.post('/tasks', data)
  },

  // Update task
  updateTask: (id: number, data: UpdateTaskData): Promise<ApiResponse<Task>> => {
    return api.put(`/tasks/${id}`, data)
  },

  // Delete task
  deleteTask: (id: number): Promise<void> => {
    return api.delete(`/tasks/${id}`)
  },

  // Get tasks with pagination
  getTasksPaginated: (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Task>> => {
    return api.get(`/tasks?page=${page}&per_page=${perPage}`)
  }
}

export default api
