import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/AuthSlice";
import userSlice from "./Slices/userSlice";
import msgSlice from "./Slices/msgSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    messages: msgSlice,
  },
});

export default store;
