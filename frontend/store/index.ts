import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slice/userSlice'
import api from './api'

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        user: userSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
