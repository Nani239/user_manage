// AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const isLogin = localStorage.getItem("IS_LOGIN");
const token = localStorage.getItem("TOKEN_DATA");
const user = localStorage.getItem("USER_DATA");
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(user),
    isLogin: isLogin,
    token: JSON.parse(token),
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLogin = true;
    },
    logout: (state) => {
      state.user = null;
      state.isLogin = false;
      state.token = null;
      localStorage.removeItem("USER_DATA");
      localStorage.removeItem("TOKEN_DATA");
      localStorage.removeItem("IS_LOGIN");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
