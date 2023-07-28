import api from '.'

export const authApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/user/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const { useLoginMutation } = authApiSlice
