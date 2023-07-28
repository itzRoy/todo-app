import api from '.'
import config from '../../../config'

type credentials = {
    email: string
    password: string
}

export const authApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials: credentials) => ({
                url: config.endpoints.login,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const { useLoginMutation } = authApiSlice
