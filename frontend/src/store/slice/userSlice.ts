import { createSlice } from '@reduxjs/toolkit'

interface User {
    access_token?: string
}

const initialState: User = { access_token: undefined }
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        storeToken: (state, action) => {
            state.access_token = action.payload
        },
        logOut: () => {
            return initialState
        },
    },
})

export const { storeToken, logOut } = userSlice.actions

export default userSlice.reducer
