// AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    myUserDetails: null,
    AllUsers: null,
    loading: false,
  },
  reducers: {
    setMyUserDetails: (state, action) => {
      state.myUserDetails = action.payload;
    },
    setAllUsers: (state, action) => {
      state.AllUsers = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setMyUserDetails, setAllUsers, setLoading } = userSlice.actions;
export default userSlice.reducer;
