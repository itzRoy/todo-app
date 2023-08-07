import api from '.'
import config from '../../../config'

const {
    isGraphQL,
    endpoints: { login, loginGL, signup, signupGL },
} = config

type credentials = {
    email: string
    password: string
    confirmPassword?: string
}

type TError = {
    data?: { errors?: { message: string }[]; message?: string }
}

interface ApiLoginResponse {
    status?: number
    message?: string
    data?: {
        access_token?: string
        login?: {
            status?: number
            access_token?: string
        }
    }
    errors?: { message: string }[]
}

interface ApiSignupResponse {
    data?: {
        success?: boolean
        message?: string
        status?: number
        signup?: {
            status?: number
            message?: string
        }
    }
    errors?: { message: string }[]
}

const signupQueryGL = (credentials: { [key: string]: string }) => ({
    query: `
query Signup($email: String!, $password: String!, $confirmPassword: String!) {
signup(email: $email, password: $password, confirmPassword: $confirmPassword ) {
status,
success,
message,
}
}`,
    variables: credentials,
})

const loginQueryGL = (credentials: { [key: string]: string }) => ({
    query: `
query Login($email: String!, $password: String!) {
login(email: $email, password: $password) {
access_token
}
}
`,
    variables: credentials,
})

export const authApiSlice = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ApiLoginResponse, credentials>({
            transformResponse(baseQueryReturnValue: ApiLoginResponse) {
                if (baseQueryReturnValue.errors) {
                    throw new Error(baseQueryReturnValue.errors[0].message)
                }

                if (baseQueryReturnValue?.data?.login) {
                    return { data: baseQueryReturnValue?.data?.login }
                }
                return baseQueryReturnValue
            },

            transformErrorResponse(baseQueryReturnValue): { message: string } {
                return {
                    message:
                        (baseQueryReturnValue as TError)?.data?.errors?.[0]?.message ||
                        (baseQueryReturnValue as TError)?.data?.message ||
                        (baseQueryReturnValue as TError)?.data?.message ||
                        '',
                }
            },

            query: (credentials: credentials) => ({
                url: isGraphQL ? loginGL : login,
                method: 'POST',
                body: isGraphQL ? loginQueryGL(credentials) : credentials,
            }),
        }),

        signup: builder.mutation<ApiSignupResponse, credentials>({
            transformResponse(baseQueryReturnValue: ApiSignupResponse) {
                if (baseQueryReturnValue.errors) {
                    throw new Error(baseQueryReturnValue.errors[0].message)
                }

                if (baseQueryReturnValue?.data?.signup) {
                    return { data: baseQueryReturnValue?.data?.signup }
                }
                return baseQueryReturnValue
            },

            transformErrorResponse(baseQueryReturnValue) {
                return {
                    message:
                        (baseQueryReturnValue as TError)?.data?.errors?.[0]?.message ||
                        (baseQueryReturnValue as TError)?.data?.message ||
                        (baseQueryReturnValue as TError)?.data?.message ||
                        '',
                }
            },

            query: (credentials: credentials) => ({
                url: isGraphQL ? signupGL : signup,
                method: 'POST',
                body: isGraphQL ? signupQueryGL(credentials) : credentials,
            }),
        }),
    }),
})

export const { useLoginMutation, useSignupMutation } = authApiSlice
