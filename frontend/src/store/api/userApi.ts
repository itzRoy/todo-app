import api from '.'
import config from '../../../config'

type credentials = {
    email: string
    password: string
}

interface ApiResponse {
    data?: {
        message?: string
        access_token?: string
        status?: number
    }
}

export const authApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ApiResponse, credentials>({
            query: (credentials: credentials) => ({
                url: config.endpoints.login,
                method: 'POST',
                body: credentials,
            }),
        }),
        signup: builder.mutation({
            query: (credentials: credentials) => ({
                url: config.endpoints.signup,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const { useLoginMutation, useSignupMutation } = authApiSlice
