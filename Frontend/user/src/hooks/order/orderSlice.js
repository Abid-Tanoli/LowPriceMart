// orderSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// ================= Thunks =================

// Fetch all user orders
export const getMyOrdersThunk = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/myorders");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch orders"
      );
    }
  }
);

// Fetch single order by ID
export const getSingleOrderThunk = createAsyncThunk(
  "order/getSingleOrder",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch order"
      );
    }
  }
);

// Create a new order
export const createOrderThunk = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders", orderData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create order"
      );
    }
  }
);

// ================= Slice =================

const initialState = {
  myOrders: [],        // stores all user orders
  singleOrder: null,   // stores selected order
  loading: false,
  error: null,
  success: false,      // tracks order creation success
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    resetOrderSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Orders
      .addCase(getMyOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.myOrders = action.payload;
        } else if (action.payload?.orders && Array.isArray(action.payload.orders)) {
          state.myOrders = action.payload.orders;
        } else {
          state.myOrders = [];
        }
      })
      .addCase(getMyOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.myOrders = [];
      })

      // Fetch Single Order
      .addCase(getSingleOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOrder = action.payload;
      })
      .addCase(getSingleOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Order
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.singleOrder = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearOrderError, resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
