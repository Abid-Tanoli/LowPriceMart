// hooks/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser, getProfile } from "../services/auth";

// Safe localStorage getter with error handling
const getStoredToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error reading token from localStorage:", error);
    return null;
  }
};

const getStoredUserInfo = () => {
  try {
    const userInfo = localStorage.getItem("userInfo");
    // Check if userInfo exists and is not "undefined" string
    if (userInfo && userInfo !== "undefined" && userInfo !== "null") {
      return JSON.parse(userInfo);
    }
    return null;
  } catch (error) {
    console.error("Error parsing userInfo from localStorage:", error);
    localStorage.removeItem("userInfo"); // Clean up corrupted data
    return null;
  }
};

const initialState = {
  token: getStoredToken(),
  userInfo: getStoredUserInfo(),
  loading: false,
  error: null,
};

// Initialize user from stored token
export const initializeUser = createAsyncThunk(
  "auth/initializeUser",
  async (_, thunkAPI) => {
    try {
      const token = getStoredToken();
      if (!token) return null;
      
      const data = await getProfile();
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Session expired"
      );
    }
  }
);

// Register user
export const registerUserThunk = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Registration failed"
      );
    }
  }
);

export const loginUserThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await loginUser(credentials);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || "Login failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.error = null;
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize User
      .addCase(initializeUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.error = null;
      })
      .addCase(initializeUser.rejected, (state, action) => {
        state.loading = false;
        state.userInfo = null;
        state.token = null;
        state.error = action.payload;
      })

      // Register User
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login User
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userInfo = action.payload.user;
        state.error = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;