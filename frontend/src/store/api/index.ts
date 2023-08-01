import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '..'
import { logOut } from '../slice/userSlice'
import config from '../../../config'

const baseQuery = fetchBaseQuery({
    baseUrl: config.api,
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState
        const token = state.user.access_token

        if (token) {
            headers.set('authorization', token)
        }
        return headers
    },
})

const baseQueryCheckAuth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    const result = await baseQuery(args, api, extraOptions)

    if (result?.error?.status === 403) {
        api.dispatch(logOut())
    }

    return result
}

const api = createApi({
    baseQuery: baseQueryCheckAuth,

    endpoints: () => ({}),
})

export default api
