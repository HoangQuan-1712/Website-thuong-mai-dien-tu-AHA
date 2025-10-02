import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    isAdmin: false,
    access_token: '',
    refresh_token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            state.name = action.payload.name
            state.email = action.payload.email
            state.password = action.payload.password
            state.confirmPassword = action.payload.confirmPassword
            state.phone = action.payload.phone
            state.isAdmin = action.payload.isAdmin
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
            console.log('action', action)
        },
        resetUser: (state) => {
            state.name = ''
            state.email = ''
            state.password = ''
            state.confirmPassword = ''
            state.phone = ''
            state.access_token = ''
            state.refresh_token = ''
            // state.isAdmin = false
            // state.isLoading = false
        },


    }
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlice.actions

export default userSlice.reducer