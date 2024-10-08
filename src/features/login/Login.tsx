import React from "react"
import Grid from "@mui/material/Grid"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { useFormik } from "formik"
import { RootState } from "../../state/store"
import { AuthDataType } from "../../api/authApi"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { authThunks } from "./authReducerRTK"
import { useAppDispatch } from "../../common/hooks/useAppDispatch"

type FormikError = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector<RootState, boolean>(
    (state) => state.auth.isLoggedIn
  )

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validate: (values) => {
      const errors: FormikError = {}
      if (!values.email) {
        errors.email = "Required"
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email = "Invalid email address"
      }
      if (values.password.length < 6) {
        errors.password = "Password must be 6 characters min"
      } else if (!values.password) {
        errors.password = "Required"
      }

      return errors
    },

    onSubmit: (values: AuthDataType) => {
      dispatch(authThunks.login(values))
      formik.resetForm()
    },
  })

  if (isLoggedIn) {
    return <Navigate to={"/"} />
  }

  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>
              <p>
                To log in get registered
                <a
                  href={"https://social-network.samuraijs.com/"}
                  target={"_blank"}>
                  here
                </a>
              </p>
              <p>or use common test account credentials:</p>
              <p>Email: free@samuraijs.com</p>
              <p>Password: free</p>
            </FormLabel>
            <FormGroup>
              <TextField
                onBlur={formik.handleBlur}
                name='email'
                onChange={formik.handleChange}
                value={formik.values.email}
                label='Email'
                margin='normal'
              />
              {formik.touched.email && formik.errors.email ? (
                <div>{formik.errors.email}</div>
              ) : null}

              <TextField
                name='password'
                onChange={formik.handleChange}
                value={formik.values.password}
                type='password'
                label='Password'
                margin='normal'
              />
              {formik.touched.password && formik.errors.password ? (
                <div>{formik.errors.password}</div>
              ) : null}
              <FormControlLabel
                name='rememberMe'
                onChange={formik.handleChange}
                checked={formik.values.rememberMe}
                label={"Remember me"}
                control={<Checkbox />}
              />

              <Button type={"submit"} variant={"contained"} color={"success"}>
                Login
              </Button>
            </FormGroup>
          </FormControl>
        </form>
      </Grid>
    </Grid>
  )
}
