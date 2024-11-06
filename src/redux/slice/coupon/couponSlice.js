import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";

// initialsState

const initialState = {
  coupons: [],
  coupon: {},
  loading: false,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

// create coupon action
export const updateCouponAction = createAsyncThunk(
  "coupons/update",
  async (
    { code, discount, startDate, endDate, id },
    { rejectWithValue, getState, dispatch }
  ) => {
    console.log(id);

    try {
      // const {
      //     name,
      // } = payload;
      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState()?.users?.userAuth?.userInfo?.token;
      // console.log("token",token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // console.log(config);

      const { data } = await axios.put(
        `${baseURL}coupons/update/${id}`,
        {
          code,
          discount,
          startDate,
          endDate,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// update coupon action
export const createCouponAction = createAsyncThunk(
  "coupons/create",
  async (
    { code, discount, startDate, endDate },
    { rejectWithValue, getState, dispatch }
  ) => {
    // console.log(code, discount, startDate, endDate);

    try {
      // const {
      //     name,
      // } = payload;
      // make request
      // Token - Authenticated - can access all slices present in state
      const token = getState()?.users?.userAuth?.userInfo?.token;
      // console.log("token",token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // console.log(config);

      const { data } = await axios.post(
        `${baseURL}coupons`,
        {
          code,
          discount,
          startDate,
          endDate,
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch Coupons action

export const fetchCouponsAction = createAsyncThunk(
  "coupons/fetch-All",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
       // Token - Authenticated - can access all slices present in state
       const token = getState()?.users?.userAuth?.userInfo?.token;
       // console.log("token",token);
 
       const config = {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       };
      const { data } = await axios.get(`${baseURL}coupons`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// fetch Coupons action

export const fetchCouponAction = createAsyncThunk(
    "coupons/fetch-single-coupon",
    async (code, { rejectWithValue, getState, dispatch }) => {
      try {
        const { data } = await axios.get(`${baseURL}coupons/single?code=${code}`,{code});
        return data;
      } catch (error) {
        return rejectWithValue(error?.response?.data);
      }
    }
  );

// delete Coupons action

export const deleteCouponAction = createAsyncThunk(
  "coupons/delete-coupon",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
       // Token - Authenticated - can access all slices present in state
       const token = getState()?.users?.userAuth?.userInfo?.token;
       // console.log("token",token);
 
       const config = {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       };
      const { data } = await axios.delete(`${baseURL}coupons/delete/${id}`, config);
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

// coupons slice

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  extraReducers: (builder) => {
    // create
    builder.addCase(createCouponAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.coupon = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.coupon = null;
      state.isAdded = false;
      state.error = action.payload;
    });

      // update
      builder.addCase(updateCouponAction.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(updateCouponAction.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
        state.isUpdated = true;
      });
      builder.addCase(updateCouponAction.rejected, (state, action) => {
        state.loading = false;
        state.coupon = null;
        state.error = action.payload;
      });

    // fetch coupons (All)
    builder.addCase(fetchCouponsAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCouponsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.coupons = action.payload;
    });
    builder.addCase(fetchCouponsAction.rejected, (state, action) => {
      state.loading = false;
      state.coupons = null;
      state.error = action.payload;
    });

    // fetch coupon 
    builder.addCase(fetchCouponAction.pending, (state) => {
        state.loading = true;
      });
      builder.addCase(fetchCouponAction.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
      });
      builder.addCase(fetchCouponAction.rejected, (state, action) => {
        state.loading = false;
        state.coupon = null;
        state.error = action.payload;
      });

          // delete
    builder.addCase(deleteCouponAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteCouponAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
    });
    builder.addCase(deleteCouponAction.rejected, (state, action) => {
      state.loading = false;
      state.isDeleted = false;
      state.error = action.payload;
    });

    // reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
    // reset success action
    builder.addCase(resetSuccessAction.pending, (state, action) => {
      state.isAdded = false;
      state.error = null;
    });
  },
});

// generate the reducer

const couponsReducer = couponSlice.reducer;

export default couponsReducer;
