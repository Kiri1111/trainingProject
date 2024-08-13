import { v1 } from 'uuid'
import { FilterValue } from '../App'
import { todolistsApi, TodolistType } from '../api/todolistsApi'
import { Dispatch } from 'redux'
import { RootState } from '../state/store'
import { title } from 'process'

export type AddTodolistType = ReturnType<typeof addTodolistAction>
export type RemoveTodolistType = ReturnType<typeof removeTodolist>
type ChangeTodolistTitle = ReturnType<typeof changeTodolistTitle>
type ChangeTodolistFilter = ReturnType<typeof changeTodolistFilter>
type setTodolists = ReturnType<typeof setTodolists>

type ActionsTypes =
  | AddTodolistType
  | RemoveTodolistType
  | ChangeTodolistTitle
  | ChangeTodolistFilter
  | setTodolists

export type TodolistDomainType = TodolistType & { filter: FilterValue }

export const idTodolist1 = v1()
export const idTodolist2 = v1()

const initialState: TodolistDomainType[] = []

export const todolistReducer = (
  state: TodolistDomainType[] = initialState,
  action: ActionsTypes
): TodolistDomainType[] => {
  switch (action.type) {
    case 'ADD_TODOLIST': {
      return [
        {
          id: action.payload.idTodolist,
          title: action.payload.title,
          filter: 'all',
          addedDate: '',
          order: 0,
        },
        ...state,
      ]
    }
    case 'REMOVE_TODOLIST': {
      return state.filter((tl) => tl.id !== action.payload.id)
    }
    case 'CHANGE_TODOLIST_TITLE': {
      return state.map((tl) =>
        tl.id === action.payload.id ? { ...tl, title: action.payload.newTitle } : tl
      )
    }
    case 'CHANGE_TODOLIST_FILTER': {
      return state.map((tl) =>
        tl.id === action.payload.id ? { ...tl, filter: action.payload.newFilterStatus } : tl
      )
    }
    case 'SET_TODOLISTS': {
      return action.payload.todolists.map((t) => ({ ...t, filter: 'all' }))
    }
    default:
      return state
  }
}

export const addTodolistAction = (title: string, idTodolist: string) => ({
  type: 'ADD_TODOLIST' as const,
  payload: { title, idTodolist },
})
export const removeTodolist = (id: string) => ({
  type: 'REMOVE_TODOLIST' as const,
  payload: { id },
})
export const changeTodolistTitle = (newTitle: string, id: string) => ({
  type: 'CHANGE_TODOLIST_TITLE' as const,
  payload: { newTitle, id },
})
export const changeTodolistFilter = (newFilterStatus: FilterValue, id: string) => ({
  type: 'CHANGE_TODOLIST_FILTER' as const,
  payload: { newFilterStatus, id },
})

export const setTodolists = (todolists: TodolistType[]) => ({
  type: 'SET_TODOLISTS' as const,
  payload: { todolists },
})

export const getTodolistsThunk = () => (dispatch: Dispatch) => {
  todolistsApi.getTodolists().then((res) => dispatch(setTodolists(res.data)))
}

export const addTodolistThunk =
  (title: string) => (dispatch: Dispatch, getState: () => RootState) => {
    todolistsApi
      .createTodolist(title)
      .then((res) => dispatch(addTodolistAction(res.data.data.item.title, res.data.data.item.id)))
  }

export const deleteTodolistThunk = (idTodolist: string) => (dispatch: Dispatch) => {
  todolistsApi.deleteTodolist(idTodolist).then((res) => dispatch(removeTodolist(idTodolist)))
}
export const updateTodolistThunk =
  (idTodolist: string, newTitle: string) => (dispatch: Dispatch) => {
    todolistsApi
      .updateTodolist(idTodolist, newTitle)
      .then((res) => dispatch(changeTodolistTitle(newTitle, idTodolist)))
  }
