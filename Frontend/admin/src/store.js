import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./hooks/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
