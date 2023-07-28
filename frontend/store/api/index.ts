import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '..'
const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3300',
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState
            const token = state.user.access_token

            if (token) {
                headers.set('access_token', token)
            }

            headers.set('Content-Type', 'application/json')
            return headers
        },
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, object-curly-newline
    endpoints: () => ({}),
})

export default api
