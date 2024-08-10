import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '3f0bd518-e3ef-420a-b8dc-d517a6d5a7f7',
  },
})

export const tasksApi = {
  getTasks(idTodolist: string) {
    return instance.get<ResponseTaskType>(`todo-lists/${idTodolist}/tasks`)
  },
  createTask(idTodolist: string, title: string) {
    return instance.post(`todo-lists/${idTodolist}/tasks`, { title })
  },
  updateTask(idTodolist: string, idTask: string, newTitle: string) {
    return instance.put(`todo-lists/${idTodolist}/tasks/${idTask}`, { newTitle })
  },
  deleteTask(idTodolist: string, idTask: string) {
    return instance.delete<ResponseTasksDoingType>(`todo-lists/${idTodolist}/tasks/${idTask}`)
  },
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriority {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  id: string
  title: string
  description: null
  todoListId: string
  order: number
  status: TaskStatuses
  priority: TaskPriority
  startDate: null
  deadline: null
  addedDate: string
}

type ResponseTaskType = {
  items: TaskType[]
  totalCount: number
  error: null
}

type ResponseTasksDoingType = {
  data: {}
  messages: string[]
  fieldsErrors: string[]
  resultCode: number
}