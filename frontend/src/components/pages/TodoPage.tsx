import PageWrapper from '../HOC/PageWrapper'
import TodoHeader from '../molecules/TodoHeader'
import TodoList from '../molecules/TodoList'
import TodoPromt from '../molecules/TodoPromt'

const TodoPage = () => {
    return (
        <>
            <div className='flex flex-1 flex-col'>
                <TodoHeader />
                <TodoList />
                <TodoPromt />
            </div>
        </>
    )
}

const Page = PageWrapper(TodoPage, 'todoPage')

export default Page
