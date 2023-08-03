import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TaskTodo from '../atoms/TaskTodo'
import { Loader } from '../atoms/'
import { ITodos, resetTodosSlice, storePagination } from '../../store/slice/todoSlice'
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
    const { result, totalPages, isTriggerRefresh, filter } = useSelector<RootState, ITodos>((state) => state.todos)

    const refresh = useCallback(
        (action?: 'delete' | 'update') => {
            setIsRefresh(true)

            getTodos({
                page: 1,
                limit: action === 'delete' ? page * limit - 1 : action === 'update' ? page * limit : limit,
                filter,
            })
        },
        [getTodos, page, filter],
    )

    const observer = useMemo(
        () =>
            new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    observer.unobserve(entries[0].target)

                    if (totalPages && totalPages > page && !isLoading) {
                        // the reason why is set like that beacause the pages arent consistent e.g previous page might be 3 and current 1
                        setPage(page + 1)
                    }
                }
            }),
        [isLoading, page, totalPages],
    )

    const deleteHandler = (id: string) => {
        setIdentifier(id)

        deleteTodo(id)
    }

    const toggleHandler = (id: string) => {
        setIdentifier(id)

        toggleTodo(id)
    }

    useEffect(() => {
        if (isDeleteSuccess) {
            resetDelete()

            refresh('delete')
        }

        if (isToggleSuccess) {
            resetToggle()

            refresh('update')
        }

        if (isTriggerRefresh) {
            if (page === 1) {
                refresh()
            } else {
                dispatch(resetTodosSlice())

                setPage(1)
            }

            listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [
        isDeleteSuccess,
        isToggleSuccess,
        refresh,
        resetDelete,
        resetToggle,
        isTriggerRefresh,
        getTodos,
        filter,
        page,
        dispatch,
    ])

    useEffect(() => {
        getTodos({ page, limit, filter })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, getTodos])

    useEffect(() => {
        if (data && !isLoading) {
            dispatch(storePagination({ isRefresh, filter, ...data.data }))

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
    }, [observer, page, result, totalPages])

    return (
        <div ref={listRef} className='max-h-[60vh] flex flex-col flex-1 overflow-y-scroll no-scrollbar'>
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
            {isLoading ? <Loader className='h-20 self-center my-1' /> : null}
        </div>
    )
}

export default TodoList
