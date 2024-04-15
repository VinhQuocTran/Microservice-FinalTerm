import { createSlice } from "@reduxjs/toolkit";

const authTokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('authToken='));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: authTokenCookie ? authTokenCookie.split('=')[1] : null,
    loading: false,
    error: false
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    loginFailure: (state) => {
      state.loading = true;
      state.error = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = false;
    }    
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout
} = userSlice.actions;

export default userSlice.reducer;