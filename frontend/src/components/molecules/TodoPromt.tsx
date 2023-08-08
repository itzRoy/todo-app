import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../store'
import { setTodosSearch, triggerRefresh } from '../../store/slice/todoSlice'
import { FormEventHandler, useEffect, useRef, useState } from 'react'
import { usePostTodoMutation } from '../../store/api/todosApi'
import { SearchIcon } from '../../assets'
import useDebounce from '../../hooks/useDebounce'

const TodoPromt = () => {
    const dispatch = useDispatch<AppDispatch>()
    const [addTodo, { isLoading, isSuccess, reset }] = usePostTodoMutation()
    const [todo, setTodo] = useState('')
    const [isSearchActive, setIsSearchActive] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const debounceValue = useDebounce(searchValue, 500)

    const onSearchClick = () => {
        setIsSearchActive((prev) => {
            if (prev && searchValue.length) {
                dispatch(setTodosSearch(''))

                dispatch(triggerRefresh())
            }
            return !prev
        })
    }

    useEffect(() => {
        if (!isSearchActive) {
            inputRef?.current?.focus()
        }
    }, [isSearchActive])

    useEffect(() => {
        if (isSearchActive && debounceValue.length) {
            dispatch(setTodosSearch(debounceValue))

            dispatch(triggerRefresh())
        }
    }, [debounceValue, dispatch, isSearchActive])

    useEffect(() => {
        setSearchValue('')

        if (isSearchActive) {
            setTodo('')

            searchRef.current?.focus()
        }
    }, [isSearchActive])

    useEffect(() => {
        if (isSuccess) {
            dispatch(triggerRefresh())

            reset()

            setTodo('')

            inputRef?.current?.focus()
        }
    }, [dispatch, isSuccess, reset])

    const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        addTodo({ todo })
    }

    return (
        <form
            onSubmit={submitHandler}
            className='flex  bg-light-input dark:bg-input py-4 pr-0 md:pr-7   dark:text-white rounded-lg'
        >
            <div
                className={`flex  items-center transition-all ease duration-300 px-2 overflow-hidden mx-2 md:mx-6 gap-2  ${
                    isSearchActive
                        ? 'border-b-[0.5px] border-text-black dark:border-white-text pb-2 md:pb-0 border-opacity-50 dark:border-opacity-10 w-full gap-10'
                        : 'w-[50px]'
                }`}
            >
                <SearchIcon
                    onClick={onSearchClick}
                    className={`dark:fill-white-text fill-text-black opacity-50 shrink-0 cursor-pointer`}
                />
                <input
                    ref={searchRef}
                    placeholder='Search'
                    name='search'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className={`${
                        isSearchActive ? 'w-full ml-2 md:ml-7' : 'w-0 hidden'
                    }  h-6 px-2 py-0 w-0 dark:placeholder:text-white-text placeholder:text-[16px] dark:placeholder:opacity-50 dark:text-white-text outline-none border-none`}
                />
            </div>
            <input
                disabled={isLoading}
                ref={inputRef}
                className={`p-0 ${
                    isSearchActive ? 'w-0' : 'w-full '
                } dark:placeholder:text-white-text placeholder:text-[16px] transition-all ease duration-300 dark:placeholder:opacity-50  dark:text-white-text outline-none border-none`}
                placeholder='New Note'
                name='todo'
                onChange={(e) => setTodo(e.target.value)}
                value={todo}
            />

            <button
                type='submit'
                disabled={isLoading || !todo.length}
                className={`button p-1 md:px-6 md:py-3 ml-auto bg-white-text hidden md:block text-text-black shrink-0 w-auto ${
                    !todo.length && 'cursor-not-allowed'
                }`}
            >
                Add New Note
            </button>
        </form>
    )
}

export default TodoPromt
