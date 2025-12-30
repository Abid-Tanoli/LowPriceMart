import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./hooks/authSlice";
import userReducer from "./hooks/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
