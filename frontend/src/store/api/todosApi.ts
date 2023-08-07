import api from '.'
import config from '../../../config'

const {
    isGraphQL,
    endpoints: { todo, todoGL },
} = config

type TresultArray = {
    _id: string
    todo: string
    complete: boolean
}[]
interface ITodoGetResponse {
    success: boolean
    status: number
    data: {
        currentPage: number
        totalItems: number
        totalPages: number
        result: TresultArray | []
        getTodos?: ITodoGetResponse
    }
}

const postTodoQueryGl = ({ todo }: { todo: string }) => ({
    query: `
mutation AddTodo($todo: String!) {
addTodo(todo: $todo ) {
status,
success,
message,
}
}`,
    variables: { todo },
})

const getTodoQueryGl = ({
    page,
    limit,
    filter,
}: {
    page: number
    limit: number
    filter: { [key: string]: boolean }
}) => ({
    query: `
query GetTodo($page: Float, $limit: Float, $filter: FilterType) {
getTodos(page: $page, limit: $limit, filter: $filter ) {
data {
    completeCount
    totalPages
    result {
        _id
        todo
        complete
    }
}
}
}`,
    variables: { page, limit, filter },
})

export const authApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        getTodos: builder.mutation<
            ITodoGetResponse,
            { page: number; limit: number; filter: { [key: string]: boolean } }
        >({
            transformResponse(baseQueryReturnValue: ITodoGetResponse) {
                if (baseQueryReturnValue.data?.getTodos) return baseQueryReturnValue.data.getTodos
                return baseQueryReturnValue
            },
            query: (arg) => {
                const { limit, page, filter } = arg
                const params = { page, limit, ...filter }

                const req: {
                    url: string
                    method: string
                    params?: typeof params
                    body?: { query: string }
                } = {
                    url: isGraphQL ? todoGL : todo,
                    method: isGraphQL ? 'POST' : 'GET',
                }

                if (isGraphQL) {
                    req.body = getTodoQueryGl({ page, limit, filter: { ...filter } })
                } else req.params = params

                return req
            },
        }),

        deleteTodo: builder.mutation({
            query: (id) => {
                return {
                    url: config.endpoints.todo + '/' + id,
                    method: 'DELETE',
                }
            },
        }),

        toggleTodo: builder.mutation({
            query: (id) => {
                return {
                    url: config.endpoints.todo + '/' + id,
                    method: 'PUT',
                }
            },
        }),

        postTodo: builder.mutation<unknown, { todo: string }>({
            query: (body) => {
                return {
                    url: isGraphQL ? todoGL : todo,
                    method: 'POST',
                    body: isGraphQL ? postTodoQueryGl(body) : body,
                }
            },
        }),
    }),
})

export const { useGetTodosMutation, usePostTodoMutation, useDeleteTodoMutation, useToggleTodoMutation } = authApiSlice
