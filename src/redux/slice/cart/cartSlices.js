import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// initialState
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  isAdded: false,
  isUpdated: false,
  isDelete: false,
};

// add product to cart
export const addOrderToCart = createAsyncThunk(
  "carts/add-to-cart",
  async (cartItem) => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    // push to storage
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
);

// remove product from cart
export const removeOrderItemQty = createAsyncThunk(
    "carts/removeOrderItem",
    async ({productId}) => {
        const cartItems = localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : []; 

        const newItems = cartItems?.filter((item)=> item?._id !== productId)
        localStorage.setItem('cartItems', JSON.stringify(newItems))
    }
  );

// get items from cart
export const getCartItemsFromLocalStorageAction = createAsyncThunk(
  "carts/get-order-items",
  async () => {
    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];
    // push to storage
    // console.log(cartItems);

    return cartItems;
  }
);

// change the qty of order
export const changeOrderItemQty = createAsyncThunk(
  "carts/get-item-qty",
  async ({ productId, qty }) => {
    // console.log(productId, qty);

    const cartItems = localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [];

    const newCartItems = cartItems?.map((item) => {
      if (item?._id === productId?.toString()) {
        // console.log(item);
        const newPrice = item?.price + qty;
        //  console.log(newPrice);
        item.qty = +qty;
        // console.log(item);
        item.totalPrice = newPrice
      }
      return item;
    });
    localStorage.setItem('cartItems', JSON.stringify(newCartItems))
  }
);

// categories slice

const cartSlice = createSlice({
  name: "cart",
  initialState,
  extraReducers: (builder) => {
    // add to cart
    builder.addCase(addOrderToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addOrderToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cartItems = action.payload;
      state.isAdded = true;
    });
    builder.addCase(addOrderToCart.rejected, (state, action) => {
      state.loading = false;
      state.cartItems = null;
      state.isAdded = false;
      state.error = action.payload;
    });
    // fetch cart items
    builder.addCase(getCartItemsFromLocalStorageAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getCartItemsFromLocalStorageAction.fulfilled,
      (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
        state.isAdded = true;
      }
    );
    builder.addCase(
      getCartItemsFromLocalStorageAction.rejected,
      (state, action) => {
        state.loading = false;
        state.cartItems = null;
        state.isAdded = false;
        state.error = action.payload;
      }
    );
  },
});

// generate the reducer

const cartReducer = cartSlice.reducer;

export default cartReducer;
