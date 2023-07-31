import { PayloadAction, createSlice } from '@reduxjs/toolkit'

type TresultArray = {
    _id: string
    todo: string
    complete: boolean
}[]
export interface ITodos {
    success?: boolean
    status?: number
    currentPage?: number
    totalItems?: number
    totalPages?: number
    result: TresultArray | []
    isRefresh?: boolean
}

const initialState: ITodos = {
    success: true,
    status: 200,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
    result: [],
}

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        storePagination: (state, action: PayloadAction<ITodos | undefined>): ITodos => {
            const { currentPage, result, status, success, totalItems, totalPages, isRefresh } = action.payload ?? {}

            return {
                currentPage,
                result: isRefresh ? (result as TresultArray) : [...state.result, ...(result as TresultArray)],
                status,
                success,
                totalItems,
                totalPages,
            }
        },
        refreshTodos: (state, action: PayloadAction<ITodos | undefined>) => {
            const { result } = action.payload ?? {}

            state.result = result as TresultArray
        },
    },
})

export const { storePagination, refreshTodos } = todoSlice.actions

export default todoSlice.reducer
