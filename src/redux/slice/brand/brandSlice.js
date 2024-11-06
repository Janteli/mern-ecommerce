import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialsState

const initialState = {
    brands: [],
    brand: {},
    loading: false,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// create brand action
export const createBrandsAction = createAsyncThunk('brands/create', async (name, {rejectWithValue, getState, dispatch})=>{
    // console.log(name);
    
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
                Authorization: `Bearer ${token}`
            }
        }
        // console.log(config);
        
        const {data} = await axios.post(`${baseURL}brands`,{
            name,
        },
    config
)
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// fetch Brands action

export const fetchBrandsAction = createAsyncThunk('brands/fetch All', async (payload, {rejectWithValue, getState, dispatch})=>{
    try {
        const {data} = await axios.get(`${baseURL}brands`,
)
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// categories slice

const brandSlice  = createSlice({
    name: "brands",
    initialState,
    extraReducers: (builder) =>{
        // create
        builder.addCase(createBrandsAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(createBrandsAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.brand = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createBrandsAction.rejected, (state, action)=>{
            state.loading = false;
            state.brand = null;
            state.isAdded = false;
            state.error = action.payload
        });

        // fetch categories (All)
        builder.addCase(fetchBrandsAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(fetchBrandsAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.brands = action.payload;
            state.isAdded = true;
        });
        builder.addCase(fetchBrandsAction.rejected, (state, action)=>{
            state.loading = false;
            state.brands = null;
            state.isAdded = false;
            state.error = action.payload
        });
        // reset error action
        builder.addCase(resetErrAction.pending, (state, action)=>{
            state.isAdded = false;
            state.error = null
        });
        // reset success action
        builder.addCase(resetSuccessAction.pending, (state, action)=>{
            state.isAdded = false;
            state.error = null
        });
    }
})

// generate the reducer

const brandReducer = brandSlice.reducer;

export default brandReducer;