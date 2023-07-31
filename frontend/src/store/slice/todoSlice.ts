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
    completeCount?: number
    result: TresultArray | []
    isRefresh?: boolean
    isTriggerRefresh?: boolean
    filter: object
}

const initialState: ITodos = {
    success: true,
    status: 200,
    currentPage: 1,
    totalItems: 0,
    totalPages: 1,
    result: [],
    isTriggerRefresh: false,
    filter: {},
    completeCount: 0,
}

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        storePagination: (state, action: PayloadAction<ITodos | undefined>): ITodos => {
            const { currentPage, result, isRefresh, filter, ...rest } = action.payload ?? {}

            return {
                currentPage,
                result: isRefresh ? (result as TresultArray) : [...state.result, ...(result as TresultArray)],
                isTriggerRefresh: false,
                filter: filter || {},
                ...rest,
            }
        },
        refreshTodos: (state, action: PayloadAction<ITodos | undefined>) => {
            const { result } = action.payload ?? {}

            state.result = result as TresultArray
        },
        triggerRefresh: (state) => {
            state.isTriggerRefresh = !state.isTriggerRefresh
        },
        setTodosFilter: (state, action: PayloadAction<object>) => {
            state.filter = action.payload
        },
        resetTodosSlice: () => {
            return initialState
        },
    },
})

export const { storePagination, refreshTodos, triggerRefresh, resetTodosSlice, setTodosFilter } = todoSlice.actions

export default todoSlice.reducer
