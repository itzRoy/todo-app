import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TaskTodo from '../atoms/TaskTodo'
import { Loader } from '../atoms/'
import { ITodos, storePagination } from '../../store/slice/todoSlice'
import { useDeleteTodoMutation, useGetTodosMutation, useToggleTodoMutation } from '../../store/api/todosApi'
import { AppDispatch, RootState } from '../../store'
import { useDispatch, useSelector } from 'react-redux'

const limit = 15

const TodoList = () => {
    const dispatch = useDispatch<AppDispatch>()
    const listRef = useRef<HTMLDivElement>(null)
    const [page, setPage] = useState(1)
    const [isRefresh, setIsRefresh] = useState(false)
    const [identifier, setIdentifier] = useState('')
    const [getTodos, { data, isLoading, reset: resetTodos }] = useGetTodosMutation()
    const [deleteTodo, { isLoading: isDeleteLoading, isSuccess: isDeleteSuccess, reset: resetDelete }] =
        useDeleteTodoMutation()
    const [toggleTodo, { isLoading: isToggleLoading, isSuccess: isToggleSuccess, reset: resetToggle }] =
        useToggleTodoMutation()
    const { result, totalPages, isTriggerRefresh } = useSelector<RootState, ITodos>((state) => state.todos)

    const refresh = useCallback(
        (isDelete: boolean = false) => {
            getTodos({ page: 1, limit: isDelete ? page * limit - 1 : page * limit })
        },
        [getTodos, page],
    )

    const observer = useMemo(
        () =>
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    observer.unobserve(entries[0].target)

                    if (totalPages && totalPages > page && !isLoading) {
                        setPage((prev) => (prev += 1))
                    }
                }
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [totalPages],
    )

    useEffect(() => {
        if (isDeleteSuccess) {
            resetDelete()

            refresh(true)

            setIsRefresh(true)
        }

        if (isToggleSuccess) {
            resetToggle()

            refresh()

            setIsRefresh(true)
        }

        if (isTriggerRefresh) {
            setIsRefresh(true)

            setPage(1)

            listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [isDeleteSuccess, isToggleSuccess, refresh, resetDelete, resetToggle, isTriggerRefresh])

    useEffect(() => {
        getTodos({ page, limit })
    }, [page, getTodos])

    useEffect(() => {
        if (data && !isLoading) {
            dispatch(storePagination({ isRefresh, ...data }))

            setIsRefresh(false)

            resetTodos()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, dispatch, isLoading, page, resetTodos])

    useEffect(() => {
        listRef.current?.lastElementChild &&
            totalPages &&
            totalPages > page &&
            observer.observe(listRef.current?.lastElementChild)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [observer, result, totalPages])

    const deleteHandler = (id: string) => {
        setIdentifier(id)

        deleteTodo(id)
    }

    const toggleHandler = (id: string) => {
        setIdentifier(id)

        toggleTodo(id)
    }

    return (
        <div ref={listRef} className='max-h-[60vh] flex flex-col flex-1 overflow-y-scroll '>
            {result?.map(({ _id, todo, complete }) => (
                <TaskTodo
                    key={_id}
                    id={_id}
                    complete={complete}
                    text={todo}
                    onDeleteClick={deleteHandler}
                    onCheckboxClick={toggleHandler}
                    isDeleteLoading={isDeleteLoading}
                    isToggleLoading={isToggleLoading}
                    identifier={identifier}
                />
            ))}
            {isLoading ? <Loader className='h-20 self-center' /> : null}
        </div>
    )
}

export default TodoList
