import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialsState

const initialState = {
    categories: [],
    category: {},
    loading: false,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// create category action
export const createCategoriesAction = createAsyncThunk('categories/create', async (payload, {rejectWithValue, getState, dispatch})=>{
    // console.log(payload);
    
    try {
        
        const {
            name,
            file
        } = payload;
// console.log(file)
        // Token - Authenticated - can access all slices present in state 
        const token = getState().users?.userAuth?.userInfo?.token;
        // console.log("token",token);
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":"multipart/form-data"
            }
        }
        // formData
        const formData = new FormData()
        formData.append('name', name);
        formData.append('file', file)
        // images
        const {data} = await axios.post(`${baseURL}categories`,formData,
    config
)
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// fetch categories action

export const fetchCategoriesAction = createAsyncThunk('categories/fetch All', async (payload, {rejectWithValue, getState, dispatch})=>{
    try {
        const {data} = await axios.get(`${baseURL}categories`)
        // console.log('fetched cat', data);
        
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

// categories slice

const categorySlice  = createSlice({
    name: "categories",
    initialState,
    extraReducers: (builder) =>{
        // create
        builder.addCase(createCategoriesAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(createCategoriesAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.category = action.payload;
            state.isAdded = true;
        });
        builder.addCase(createCategoriesAction.rejected, (state, action)=>{
            state.loading = false;
            state.category = null;
            state.isAdded = false;
            state.error = action.payload
        });

        // fetch categories (All)
        builder.addCase(fetchCategoriesAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(fetchCategoriesAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.categories = action.payload;
        });
        builder.addCase(fetchCategoriesAction.rejected, (state, action)=>{
            state.loading = false;
            state.categories = null;
            state.error = action.payload
        });
        // reset err
        builder.addCase(resetErrAction.pending, (state, action)=>{
            state.error = null
        });
        builder.addCase(resetSuccessAction.pending, (state, action)=>{
            state.error = null
        })
    }
})

// generate the reducer

const categoryReducer = categorySlice.reducer;

export default categoryReducer;