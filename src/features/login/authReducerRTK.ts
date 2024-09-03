import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { authApi } from "../../api/authApi"
import { appActions } from "../../model/appReducerRTK"

const initialState = {
  isLoggedIn: false,
  isInitialized: true,
}

type InitialStateType = typeof initialState

//thunks

const initializedApp = createAsyncThunk(
  "auth/initializedApp",
 async (initialState, thunkApi) => {
    const { dispatch } = thunkApi
    dispatch(appActions.changeAppStatus({ status: "loading" }))
   const res=await authApi.me()
   authApi
      .me()
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(authActions.setIsloggedIn({ isLoggedIn: true }))
        } else {
          dispatch(appActions.setAppError({ error: res.data.messages[0] }))
        }
      })
      .catch((e) => dispatch(appActions.setAppError({ error: e.toString() })))
      .finally(() => {
        dispatch(authActions.setIsInitialized({ isInitialized: true }))
        dispatch(appActions.changeAppStatus({ status: "succes" }))
      })
  }
)

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsloggedIn: (
      state: InitialStateType,
      action: PayloadAction<{ isLoggedIn: boolean }>
    ) => {
      state.isLoggedIn = action.payload.isLoggedIn
    },
    setIsInitialized: (
      state: InitialStateType,
      action: PayloadAction<{ isInitialized: boolean }>
    ) => {
      state.isInitialized = action.payload.isInitialized
    },
  },
})

export const authReducer = slice.reducer

export const authActions = slice.actions

export const authThunks = { initializedApp }
