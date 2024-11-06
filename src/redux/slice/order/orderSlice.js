import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";

// initialsState

const initialState = {
  orders: [],
  order: null,
  loading: false,
  console: null,
  isAdded: false,
  isUpdated: false,
  stats: null,
};

// place order action
export const placeOrderAction = createAsyncThunk(
  "orders/place-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);

    try {
      const { orderItems, shippingAddress, totalPrice } = payload;

      console.log(orderItems);

      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState().users?.userAuth?.userInfo?.token;
      // console.log("token",token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${baseURL}orders`,
        {
          orderItems,
          shippingAddress,
          totalPrice,
        },
        config
      );
      return window.open(data?.url);
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch  orders action (All)
export const fetchOrdersAction = createAsyncThunk(
  "orders/list",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState().users?.userAuth?.userInfo?.token;
      // console.log("token",token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}orders`, config);
      // console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch  orders action (All)
export const OrderStatsAction = createAsyncThunk(
  "orders/stats",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState().users?.userAuth?.userInfo?.token;
      console.log("token", token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}orders/sales/stats`, config);
      console.log(data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch  order action single
export const fetchSingOrderAction = createAsyncThunk(
  "orders/details",
  async (productId, { rejectWithValue, getState, dispatch }) => {
    // console.log(productId)
    try {
      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState().users?.userAuth?.userInfo?.token;
      // console.log("token",token);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${baseURL}orders/${productId}`, config);
      console.log("fetchSing", data);

      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// update status order
export const updateOrderAction = createAsyncThunk(
  "orders/update-order",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    console.log(payload);

    try {
      const { status, id } = payload;


      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState().users?.userAuth?.userInfo?.token;
      // console.log("token",token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        `${baseURL}orders/update/${id}`,
        {
         status
        },
        config
      );
      console.log(data);
      
      return data
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// product slice

const orderSlice = createSlice({
  name: "orders",
  initialState,
  extraReducers: (builder) => {
    // create
    builder.addCase(placeOrderAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(placeOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
      state.isAdded = true;
    });

    builder.addCase(placeOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.order = null;
      state.isAdded = false;
      state.error = action.payload;
    });

    // fetch product

    builder.addCase(fetchOrdersAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
      state.isAdded = true;
    });

    builder.addCase(fetchOrdersAction.rejected, (state, action) => {
      state.loading = false;
      state.orders = null;
      state.error = action.payload;
    });

    // fetch product -single

    builder.addCase(fetchSingOrderAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSingOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });

    builder.addCase(fetchSingOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.order = null;
      state.error = action.payload;
    });

    // stats
    builder.addCase(OrderStatsAction.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(OrderStatsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
      state.isAdded = true;
    });

    builder.addCase(OrderStatsAction.rejected, (state, action) => {
      state.loading = false;
      state.stats = null;
      state.isAdded = false;
      state.error = action.payload;
    });

     // update status
     builder.addCase(updateOrderAction.pending, (state, action) => {
        state.loading = true;
      });
  
      builder.addCase(updateOrderAction.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      });
  
      builder.addCase(updateOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.order = null;
        state.error = action.payload;
      });

    // reset success
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
    });

    // reset error
    builder.addCase(resetErrAction.rejected, (state, action) => {
      state.error = null;
    });
  },
});

// generate the reducer

const orderReducer = orderSlice.reducer;

export default orderReducer;
