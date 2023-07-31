import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { triggerRefresh } from '../../store/slice/todoSlice'
import { useEffect, useRef, useState } from 'react'
import { usePostTodoMutation } from '../../store/api/todosApi'

const TodoPromt = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [addTodo, { isLoading, isSuccess, reset }] = usePostTodoMutation()
    const [todo, setTodo] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef?.current?.focus()
    }, [])

    useEffect(() => {
        if (isSuccess) {
            dispatch(triggerRefresh())

            reset()

            setTodo('')
        }
    }, [dispatch, isSuccess, reset])

    const submitHandler = () => {
        addTodo({ todo })
    }

    return (
        <div className='flex  bg-light-input dark:bg-input py-4 px-7   dark:text-white rounded-lg'>
            <input
                disabled={isLoading}
                ref={inputRef}
                className='p-0 w-full dark:placeholder:text-white-text placeholder:text-[16px] dark:placeholder:opacity-50 dark:text-white-text outline-none border-none'
                placeholder='New Note'
                name='todo'
                onChange={(e) => setTodo(e.target.value)}
                value={todo}
            />
            <button
                onClick={submitHandler}
                type='button'
                disabled={isLoading || !todo.length}
                className={`button px-6 py-3 bg-white-text text-text-black shrink-0 w-auto ${
                    !todo.length && 'cursor-not-allowed'
                }`}
            >
                Add New Note
            </button>
        </div>
    )
}

export default TodoPromt
