import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import userSlice from './slice/userSlice'
import api from './api'
import todoSlice from './slice/todoSlice'

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'],
}

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    user: userSlice,
    todos: todoSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
