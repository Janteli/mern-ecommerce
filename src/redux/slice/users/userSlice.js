// redux APIs
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// for querying action - createAsyncThunk or create action

// slice- individual entities - section for what controllers and endpoints are created
// each endpoints are actions

import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction } from "../globalActions/globalActions";

const initialState = {
  loading: false,
  console: null,
  users: [],
  user: null,
  isCreated: false,
  profile: {},
  userAuth: {
    loading: false,
    error: null,
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
  },
};

// update user shipping address action
export const updateUserShippingAction = createAsyncThunk(
  "users/update-shipping-address",
  async (
    { firstName, lastName, address, city, postalCode, phone, country },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
         // Token - Authenticated - can access all slices present in state 
         const token = getState()?.users?.userAuth?.userInfo?.token;
         // console.log("token",token);
         
         const config = {
             headers: {
                 Authorization: `Bearer ${token}`
             }
         }
      // make the http request
      const { data } = await axios.put(`${baseURL}users/update/shipping`, {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        phone,
        country
      }, config);
      // console.log("response",data);

      return data;
    } catch (error) {
      console.log(error?.response?.data);
      return rejectWithValue(error?.response?.data);
    }
  }
);

// user profile action
export const getUserProfileAction = createAsyncThunk(
    "users/profile-fetched",
    async (payload,{ rejectWithValue, getState, dispatch }
    ) => {
      try {
           // Token - Authenticated - can access all slices present in state 
           const token = getState()?.users?.userAuth?.userInfo?.token;
           // console.log("token",token);
           
           const config = {
               headers: {
                   Authorization: `Bearer ${token}`
               }
           }
        // make the http request
        const { data } = await axios.get(`${baseURL}users/profile`, config);
        // console.log("response",data);
  
        return data;
      } catch (error) {
        console.log(error?.response?.data);
        return rejectWithValue(error?.response?.data);
      }
    }
  );

  // logout action
export const logoutAction = createAsyncThunk(
  "users/logout",
  async (payload,{ rejectWithValue, getState, dispatch }
  ) => {
   
      localStorage.removeItem('userInfo')
      return true;
  }
);

export const registerUserAction = createAsyncThunk(
  "users/register",
  async (
    { email, password, fullname },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // make the http request
      const { data } = await axios.post(`${baseURL}users/register`, {
        email,
        password,
        fullname,
      });
      // console.log("response",data);

      return data;
    } catch (error) {
      console.log(error?.response?.data);
      return rejectWithValue(error?.response?.data);
    }
  }
);

// login action

export const loginUserAction = createAsyncThunk(
  "users/login",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      // make the http request
      const response = await axios.post(`${baseURL}users/login`, {
        email: payload?.email,
        password: payload?.password,
      });
      // save the user in local storage
      // console.log("response",response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error?.response?.data);
    }
  }
);

// users slice
// extraReducers and reducers both are to handle actions but difference is extraReducers is to handle async actions and reducers is asynchronous action
// action created has 3 states - pending, fullfilled and rejected
const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    // builder triggers action like loginUserAction
    // login
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userAuth.loading = true;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth.userInfo = action.payload;
      state.userAuth.loading = false;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userAuth.error = action.payload;
      state.userAuth.loading = false;
    });

       // logout
       builder.addCase(logoutAction.fulfilled, (state, action) => {
        state.userAuth.userInfo = null;
      });
    // register user

    builder.addCase(registerUserAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.isCreated = true
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    // shipping address

    builder.addCase(updateUserShippingAction.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateUserShippingAction.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(updateUserShippingAction.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

     // profile

     builder.addCase(getUserProfileAction.pending, (state, action) => {
        state.loading = true;
      });
      builder.addCase(getUserProfileAction.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      });
      builder.addCase(getUserProfileAction.rejected, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      });

    // reset error action
    builder.addCase(resetErrAction.pending, (state, action) => {
      state.error = null;
    });
  },
});

// generate reducers

const userReducer = userSlice.reducer;

export default userReducer;
