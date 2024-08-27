import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../state/store'
import { ErrorMessageType, setAppError } from '../model/appReducer'

export function ErrorSnackbar() {
  const error = useSelector<RootState, ErrorMessageType>((state) => state.app.error)
  const dispatch = useAppDispatch()

  const handleClose = () => {
    dispatch(setAppError(null))
  }

  return (
    <Box sx={{ width: 500 }}>
      <Snackbar
        ContentProps={{
          sx: {
            background: 'red',
          },
        }}
        autoHideDuration={4000}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        open={error !== null}
        onClose={handleClose}
        message={error}
      />
    </Box>
  )
}