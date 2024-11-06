import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// initialsState

const initialState = {
    products: [],
    product: {},
    loading: false,
    console: null,
    isAdded: false,
    isUpdated: false,
    isDeleted: false,
};

// create product action 
export const createProductAction = createAsyncThunk('products/create', async (payload, {rejectWithValue, getState, dispatch})=>{
//    console.log(payload);
   
    try {
        const {
            name,
            description,
            category,
            sizes,
            brand,
            colors,
            price,
            totalQty,
            files
        } = payload;
        // make request
        // Token - Authenticated - can access all slices present in state 
        const token = getState().users?.userAuth?.userInfo?.token;
        // console.log("token",token);
        
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type":"multipart/form-data"
            },
        };
        // FormData
        const formData = new FormData();
        formData.append('name',name);
        formData.append('description',description);
        formData.append('category',category);
        formData.append('totalQty',totalQty);
        formData.append('price',price);
        formData.append('brand',brand);


        sizes.forEach((size) => {
            formData.append("sizes", size)
        });

        colors.forEach((color) => {
            formData.append("colors", color)
        });

        files.forEach((file) => {
            formData.append("files", file)
        });

        const {data} = await axios.post(`${baseURL}products`,
        //     {
        //     name,
        //     description,
        //     category,
        //     sizes,
        //     brand,
        //     colors,
        //     price,
        //     totalQty,
        //     files
        // }instead
        formData,
    config)
        return data;
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})

export const updateProductAction = createAsyncThunk('products/update', async (payload, {rejectWithValue, getState, dispatch})=>{
    //    console.log(payload);
       
        try {
            const {
                name,
                description,
                category,
                sizes,
                brand,
                colors,
                price,
                totalQty,
                id
            } = payload;
            // make request
            // Token - Authenticated - can access all slices present in state 
            const token = getState().users?.userAuth?.userInfo?.token;
            // console.log("token",token);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // "Content-Type":"multipart/form-data"
                },
            };
            const {data} = await axios.put(`${baseURL}products/${id}`,
                {
                name,
                description,
                category,
                sizes,
                brand,
                colors,
                price,
                totalQty,
            },
        config)
            // console.log(data);
            
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    })

// fetch  product action (All)
export const fetchProductAction = createAsyncThunk('products/list', async ({url}, {rejectWithValue, getState, dispatch})=>{
    // console.log(url);
    
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
    
            const {data} = await axios.get(`${url}`,
        config)
            return data;
        } catch (error) {
            return rejectWithValue(error?.response?.data)
        }
    })

// fetch  product action single
export const fetchSingProductAction = createAsyncThunk('products/details', async (productId, {rejectWithValue, getState, dispatch})=>{
    console.log(productId)
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

        const {data} = await axios.get(`${baseURL}products/${productId}`,
    config)
    console.log('fetchSing',data);

        return data;
        
    } catch (error) {
        return rejectWithValue(error?.response?.data)
    }
})    

// product slice

const productSlice  = createSlice({
    name: "products",
    initialState,
    extraReducers: (builder) =>{
        // create
        builder.addCase(createProductAction.pending, (state)=>{
            state.loading = true;
        });

        builder.addCase(createProductAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.product = action.payload;
            state.isAdded = true;
        });

        builder.addCase(createProductAction.rejected, (state, action)=>{
            state.loading = false;
            state.product = null;
            state.isAdded = false;
            state.error = action.payload
        });

             // update
             builder.addCase(updateProductAction.pending, (state)=>{
                state.loading = true;
            });
    
            builder.addCase(updateProductAction.fulfilled, (state, action)=>{
                state.loading = false;
                state.product = action.payload;
                state.isUpdated = true;
            });
    
            builder.addCase(updateProductAction.rejected, (state, action)=>{
                state.loading = false;
                state.product = null;
                state.isUpdated = false;
                state.error = action.payload
            });

        // fetch product

        builder.addCase(fetchProductAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(fetchProductAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.products = action.payload;
            state.isAdded = true;
        });

        builder.addCase(fetchProductAction.rejected, (state, action)=>{
            state.loading = false;
            state.products = null;
            state.isAdded = false;
            state.error = action.payload
        });

           // fetch product -single

           builder.addCase(fetchSingProductAction.pending, (state)=>{
            state.loading = true;
        });
        builder.addCase(fetchSingProductAction.fulfilled, (state, action)=>{
            state.loading = false;
            state.product = action.payload;
        });

        builder.addCase(fetchSingProductAction.rejected, (state, action)=>{
            state.loading = false;
            state.product = null;
            state.error = action.payload
        });

         // reset success
         builder.addCase(resetSuccessAction.pending, (state, action)=>{
            state.isAdded= false
        });

         // reset error
         builder.addCase(resetErrAction.rejected, (state, action)=>{
            state.error= null
        })
    }
})

// generate the reducer

const productReducer = productSlice.reducer;

export default productReducer;