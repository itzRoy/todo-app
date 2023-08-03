import api from '.'
import config from '../../../config'

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
    }
}

export const authApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        // eslint-disable-next-line @typescript-eslint/ban-types
        getTodos: builder.mutation<ITodoGetResponse, { page: number; limit: number; filter: {} }>({
            query: (arg) => {
                const { limit, page, filter } = arg
                const params = { page, limit, ...filter }

                return {
                    url: config.endpoints.todo,
                    method: 'GET',
                    params,
                }
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
            query: (todo) => {
                return {
                    url: config.endpoints.todo,
                    method: 'POST',
                    body: todo,
                }
            },
        }),
    }),
})

export const { useGetTodosMutation, usePostTodoMutation, useDeleteTodoMutation, useToggleTodoMutation } = authApiSlice
