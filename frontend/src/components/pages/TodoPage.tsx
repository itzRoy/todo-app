import PageWrapper from '../HOC/PageWrapper'

const TodoPage = () => {
    return <div>TodoPage</div>
}

const Page = PageWrapper(TodoPage, 'todoPage')

export default Page
