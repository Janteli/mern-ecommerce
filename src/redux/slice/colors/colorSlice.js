import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialsState

const initialState = {
    colors: [],
    color: {},
    loading: false,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// create color action
export const createColorsAction = createAsyncThunk('colors/create', async (name, {rejectWithValue, getState, dispatch})=>{
    try {
        // const {
        //     name,
        // } = payload;
        // make request
        // Token - Authenticated - can access all slices present in state 
        const token = getState().users?.userAuth?.userInfo?.token;
        // console.log("token",token);
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        // images
        const {data} = await axios.post(`${baseURL}colors`,{
            name,
        },
    config
)
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// fetch colors action

export const fetchColorsAction = createAsyncThunk('colors/fetch All', async (payload, {rejectWithValue, getState, dispatch})=>{
    try {
        const {data} = await axios.get(`${baseURL}colors`,
)
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// categories slice

const colorSlice  = createSlice({
    name: "colors",
    initialState,
    extraReducers: (builder) =>{
        // create
        builder.addCase(createColorsAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(createColorsAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.color = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createColorsAction.rejected, (state, action)=>{
            state.loading = false;
            state.color = null;
            state.isAdded = false;
            state.error = action.payload
        });

        // fetch categories (All)
        builder.addCase(fetchColorsAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(fetchColorsAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.colors = action.payload;
            state.isAdded = true;
        });
        builder.addCase(fetchColorsAction.rejected, (state, action)=>{
            state.loading = false;
            state.colors = null;
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

const colorReducer = colorSlice.reducer;

export default colorReducer;