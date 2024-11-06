import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/users/userSlice";
import productReducer from "../slice/products/productSlices";
import categoryReducer from "../slice/categories/categoriesSlice";
import brandReducer from "../slice/brand/brandSlice";
import colorReducer from "../slice/colors/colorSlice";
import cartReducer from "../slice/cart/cartSlices";
import couponsReducer from "../slice/coupon/couponSlice";
import orderReducer from "../slice/order/orderSlice";
import reviewReducer from "../slice/review/reviewSlice";

// store 
const store = configureStore({
    reducer:{
        users: userReducer,
        products: productReducer,
        categories: categoryReducer,
        brands: brandReducer,
        colors: colorReducer,
        carts: cartReducer,
        coupons: couponsReducer,
        orders: orderReducer,
        reviews: reviewReducer
    }
})

export default store;