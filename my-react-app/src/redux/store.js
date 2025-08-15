import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../redux/slices/counterSlice'

export default configureStore({
    reducer: {
        counter: counterReducer
    }
})