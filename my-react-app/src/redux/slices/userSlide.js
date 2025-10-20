import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    _id: '',  // Thêm field _id
    id: '',   // Thêm field id
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    avatar: '',
    dob: { day: null, month: null, year: null },
    gender: 'other',
    defaultAddress: null,
    isAdmin: false,
    access_token: '',
    refresh_token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const p = action.payload || {};

            // QUAN TRỌNG: Cập nhật _id và id
            state._id = p._id ?? state._id;
            state.id = p.id ?? p._id ?? state.id;

            state.username = p.username ?? state.username;
            state.name = p.name ?? state.name;
            state.email = p.email ?? state.email;
            state.phone = p.phone ?? state.phone;
            state.avatar = p.avatar ?? state.avatar;
            state.dob = p.dob ?? state.dob;
            state.gender = p.gender ?? state.gender;
            state.defaultAddress = p.defaultAddress ?? state.defaultAddress;
            state.isAdmin = p.isAdmin ?? state.isAdmin;
            state.access_token = p.access_token ?? state.access_token;
            state.refresh_token = p.refresh_token ?? state.refresh_token;
        },
        resetUser: (state) => {
            state._id = '';
            state.id = '';
            state.username = '';
            state.name = '';
            state.email = '';
            state.password = '';
            state.confirmPassword = '';
            state.phone = '';
            state.avatar = '';
            state.dob = { day: null, month: null, year: null };
            state.gender = 'other';
            state.defaultAddress = null;
            state.access_token = '';
            state.refresh_token = '';
            state.isAdmin = false;
        },
    }
})

export const { updateUser, resetUser } = userSlice.actions
export default userSlice.reducer