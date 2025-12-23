import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, getProfile } from "../services/auth";

const token = localStorage.getItem("token");
const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

export const initializeUser = createAsyncThunk(
  "auth/initializeUser",
  async (_, thunkAPI) => {
    try {
      if (!token) return null;
      const data = await getProfile();      
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Session expired");
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      return data.user; // includes role
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// ================== LOGIN USER ==================
export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      return data.user; 
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },
  },
  extraReducers: (builder) => {
    builder
     
      .addCase(initializeUser.pending, (state) => { state.loading = true; })
      .addCase(initializeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(initializeUser.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.error = action.payload;
      })

     
      .addCase(registerUserThunk.pending, (state) => { state.loading = true; })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     
      .addCase(loginUserThunk.pending, (state) => { state.loading = true; })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
