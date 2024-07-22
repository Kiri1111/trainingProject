import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValueType} from "./App";
import {Button} from "./Button";
import s from "./Todolist.module.css"

export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodolistPropsType = {
    titleTodo: string
    tasks: TaskType[]
    deleteTaskCallBack: (id: string) => void
    changeFilterStatusCallBack: (value: FilterValueType) => void
    addTaskCallBack: (newTitle: string) => void
    changeTaskStatus: (idTask: string, status: boolean) => void
}
export const Todolist = (props: TodolistPropsType) => {
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [error, setError] = useState<null | string>(null)
    const addTaskHandler = () => {
        if (newTaskTitle.trim() !== '') {
            props.addTaskCallBack(newTaskTitle.trim())
        } else {
            setError('Title is required')
        }
        setNewTaskTitle('')
    }
    const setNewTaskTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(null)
        setNewTaskTitle(e.currentTarget.value)
    }
    const onKeyUpHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTaskTitle.trim() !== '') {
            props.addTaskCallBack(newTaskTitle.trim())
            setNewTaskTitle('')
        }
        if (e.key === 'Enter' && newTaskTitle.trim() === '')
            setError('Title is required')
    }
    const changeAllFilter = () => props.changeFilterStatusCallBack('all')
    const changeActiveFilter = () => props.changeFilterStatusCallBack('active')
    const changeCompletedFilter = () => props.changeFilterStatusCallBack('completed')

    return (
        <div className={s.todolist}>
            <h3>{props.titleTodo}</h3>
            <div className={s.addTaskBlock}>
                <input className={error ? s.errorInput : ''} onKeyUp={onKeyUpHandler} value={newTaskTitle}
                       onChange={setNewTaskTitleHandler}/>
                <Button title={'+'} callBack={addTaskHandler}/>
            </div>
            {error && <div className={s.errorText}>{error}</div>}
            <div>
                <ul>
                    {props.tasks.map((t) => {
                        const deleteTaskHandler = () => props.deleteTaskCallBack(t.id)

                        const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => props.changeTaskStatus(t.id, e.currentTarget.checked)

                        return <li style={{listStyleType: "none"}}
                                   key={t.id}>
                            <div className={s.title}>
                                <input type={"checkbox"} onChange={changeStatusHandler} checked={t.isDone}/>
                                <span className={s.title}>{t.title}</span>
                                <Button title={'X'} callBack={deleteTaskHandler}/>
                            </div>
                        </li>
                    })}
                </ul>
                <div className={s.filterButtons}>
                    <Button title={'ALL'} callBack={changeAllFilter}/>
                    <Button title={'ACTIVE'} callBack={changeActiveFilter}/>
                    <Button title={'COMPLETED'} callBack={changeCompletedFilter}/>
                </div>
            </div>
        </div>
    );
};

