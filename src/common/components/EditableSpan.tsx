import React, { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField'

type EditableSpanProps = {
  title: string
  callBack: (editTitle: string) => void
}
export const EditableSpan = ({ callBack, title }: EditableSpanProps) => {
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  const onDoubleClickHandler = () => setEditMode(true)
  const onInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setEditTitle(e.currentTarget.value)
  const onBlurInputHandler = () => {
    setEditMode(false)
    callBack(editTitle)
  }

  return (
    <div>
      {editMode ? (
        <TextField
          autoFocus
          onBlur={onBlurInputHandler}
          value={editTitle}
          onChange={onInputChangeHandler}
          size='small'
          variant='standard'
        />
      ) : (
        <span onDoubleClick={onDoubleClickHandler}>{title}</span>
      )}
    </div>
  )
}
