import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import {
  resetErrAction,
  resetSuccessAction,
} from "../globalActions/globalActions";

// initialsState

const initialState = {
  reviews: [],
  review: {},
  loading: false,
  isAdded: false,
  isUpdated: false,
  isDeleted: false,
};

// create review action
export const createReviewAction = createAsyncThunk(
  "reviews/create",
  async (
    { rating, message, id },
    { rejectWithValue, getState, dispatch }
  ) => {

    try {    
      // Token - Authenticated - can access all slices present in state
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      // console.log(config);

      const { data } = await axios.post(
        `${baseURL}reviews/${id}`,
        {
          rating, message, id
        },
        config
      );
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);


// coupons slice

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  extraReducers: (builder) => {
    // create
    builder.addCase(createReviewAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createReviewAction.fulfilled, (state, action) => {
      state.loading = false;
      state.review = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createReviewAction.rejected, (state, action) => {
      state.loading = false;
      state.review = null;
      state.isAdded = false;
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

const reviewReducer = reviewSlice.reducer;

export default reviewReducer;
