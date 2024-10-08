import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TasksState } from "../../../../App"
import {
  TaskForUpdateType,
  TaskStatuses,
  TaskType,
  tasksApi,
} from "../../../../api/tasksApi"
import { todolistsActions } from "../../todolistReducerRTK"
import { appActions } from "../../../../model/appReducerRTK"
import { RootState } from "../../../../state/store"
import { ResultCode } from "../../../../common/resultCodes"

const initialState: TasksState = {}

//Thunks

const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (todolistId: string, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi
    dispatch(appActions.changeAppStatus({ status: "loading" }))
    try {
      const res = await tasksApi.getTasks(todolistId)
      const tasks = res.data.items
      if (res.data.error === null) {
        return { tasks, todolistId }
      }
    } catch (e: any) {
      dispatch(appActions.setAppError({ error: e.toString() }))
      rejectWithValue(null)
    } finally {
      dispatch(appActions.changeAppStatus({ status: "succes" }))
    }
  }
)

const addTask = createAsyncThunk(
  "tasks/addTask",
  async (arg: { title: string; todolistId: string }, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi
    dispatch(appActions.changeAppStatus({ status: "loading" }))

    try {
      const res = await tasksApi.createTask(arg.todolistId, arg.title)
      const task = res.data.data.item
      if (res.data.resultCode === ResultCode.Succes) {
        return { task }
      }
    } catch (e: any) {
      dispatch(appActions.setAppError({ error: e.toString() }))
      rejectWithValue(null)
    } finally {
      dispatch(appActions.changeAppStatus({ status: "succes" }))
    }
  }
)

const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (arg: { taskId: string; todolistId: string }, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi
    dispatch(appActions.changeAppStatus({ status: "loading" }))

    try {
      const res = await tasksApi.deleteTask(arg.taskId, arg.todolistId)
      if (res.data.resultCode === ResultCode.Succes) {
        return { arg }
      }
    } catch (e: any) {
      dispatch(appActions.setAppError({ error: e.toString() }))
      rejectWithValue(null)
    } finally {
      dispatch(appActions.changeAppStatus({ status: "succes" }))
    }
  }
)

const updateTaskStatus = createAsyncThunk(
  "tasks/updateTaskStatus",
  async (
    arg: { taskId: string; todolistId: string; status: TaskStatuses },
    thunkApi
  ) => {
    const { dispatch, rejectWithValue, getState } = thunkApi
    dispatch(appActions.changeAppStatus({ status: "loading" }))

    const rootState: any = getState()
    const task = rootState.tasks[arg.todolistId].find(
      (t: any) => t.id === arg.taskId
    )
    const taskModel: TaskForUpdateType = {
      title: task.title,
      description: null,
      priority: task.priority,
      deadline: "",
      startDate: "",
      status: arg.status,
    }
    try {
      const res = await tasksApi.updateTaskStatus(
        arg.todolistId,
        arg.taskId,
        taskModel
      )

      if (res.data.resultCode === ResultCode.Succes) {
        return { arg, taskModel }
      }
    } catch (e: any) {
      dispatch(appActions.setAppError({ error: e.toString() }))
      rejectWithValue(arg)
    } finally {
      dispatch(appActions.changeAppStatus({ status: "succes" }))
    }
  }
)

const updateTaskTitle = createAsyncThunk(
  "tasks/updateTaskTitle",
  async (
    arg: { taskId: string; todolistId: string; newTitle: string },
    thunkApi
  ) => {
    const { dispatch, rejectWithValue, getState } = thunkApi
    dispatch(appActions.changeAppStatus({ status: "loading" }))

    const rootState: any = getState()
    const task = rootState.tasks[arg.todolistId].find(
      (t: any) => t.id === arg.taskId
    )
    const taskModel: TaskForUpdateType = {
      title: arg.newTitle,
      description: null,
      priority: task.priority,
      deadline: "",
      startDate: "",
      status: task.status,
    }
    try {
      const res = await tasksApi.updateTaskTitle(
        arg.todolistId,
        arg.taskId,
        taskModel
      )

      if (res.data.resultCode === ResultCode.Succes) {
        return { arg, taskModel }
      }
    } catch (e: any) {
      dispatch(appActions.setAppError({ error: e.toString() }))
      rejectWithValue(arg)
    } finally {
      dispatch(appActions.changeAppStatus({ status: "succes" }))
    }
  }
)

const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const tasks = state[action.payload!.arg.todolistId]
        const index = tasks.findIndex(
          (t) => t.id === action.payload!.arg.taskId
        )

        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload?.taskModel }
        }
      })
      .addCase(todolistsActions.addTodolist, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(todolistsActions.removeTodolist, (state, action) => {
        delete state[action.payload.todolistId]
      })
      .addCase(todolistsActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = []
        })
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload!.todolistId] = action.payload!.tasks
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload!.task.todoListId]
        tasks.unshift(action.payload!.task)
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const tasks = state[action.payload!.arg.todolistId]
        const index = tasks.findIndex(
          (t) => t.id === action.payload?.arg.taskId
        )
        state[action.payload!.arg.todolistId].splice(index, 1)
      })
      .addCase(updateTaskTitle.fulfilled, (state, action) => {
        const tasks = state[action.payload!.arg.todolistId]
        const index = tasks.findIndex(
          (t) => t.id === action.payload!.arg.taskId
        )

        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...action.payload?.taskModel }
        }
      }),
})

export const tasksReducer = slice.reducer

export const tasksThunks = {
  fetchTasks,
  addTask,
  deleteTask,
  updateTaskStatus,
  updateTaskTitle,
}

export const tasksActions = slice.actions
