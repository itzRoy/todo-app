import { useDispatch } from 'react-redux'
import PageWrapper from '../HOC/PageWrapper'
import TodoHeader from '../molecules/TodoHeader'
import TodoList from '../molecules/TodoList'
import TodoPromt from '../molecules/TodoPromt'
import { AppDispatch } from '../../store'
import { resetTodosSlice } from '../../store/slice/todoSlice'
import { useEffect } from 'react'

const TodoPage = () => {
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        return () => {
            dispatch(resetTodosSlice())
        }
    }, [dispatch])

    return (
        <>
            <div className='max-h-[87%] md:max-h[97%] h-full flex flex-col'>
                <TodoHeader />
                <TodoList />
                <TodoPromt />
            </div>
        </>
    )
}

const Page = PageWrapper(TodoPage, 'todoPage')

export default Page
