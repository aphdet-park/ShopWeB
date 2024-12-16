import {
  createSlice,
  createAsyncThunk,
  createSelector
} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "cart/fetchProducts",
  async () => {
  
    const response = await axios.get( "https://dummyjson.com/products ");
    return response.data.products; // return products array directly
  }
);
const initialState = {
  products: [],
  status: "idle",
  error: null,
  cart: [],
  selectedCategory: ""
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action) => {
      const item = state.cart.find((product) => product.id === action.payload.id);
      const productInStock = state.products.find((product) => product.id === action.payload.id);

      if (productInStock && productInStock.stock > 0){
        if (item) {
          item.quantity +=  1;
        } else {
          state.cart.push({ ...action.payload, quantity: 1});
        }
        productInStock.stock -= 1;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const cartItem = state.cart.find((product) => product.id === id);
      const productInStock = state.products.find((product) => product.id === id);

      if (cartItem && productInStock){
        productInStock.stock += cartItem.quantity;
      }
      state.cart = state.cart.filter((product) => product.id !== id);
    },
    incrementItem: (state, action) => {
      const item = state.cart.find((product) => product.id === action.payload);
      const productInStock = state.products.find(
        (product) => product.id === action.payload
      );

      if (item && productInStock.stock > 0) {
        if (item){
          item.quantity += 1;
        } productInStock.stock -= 1;
      }else {
        alert ("cannot add more thee available stock");
      }
    },
    decrementItem: (state, action) => {
      const item = state.cart.find((product) => product.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;

          const productInStock = state.products.find(
            (product) => product.id === item.id
          );
          if(productInStock){
            productInStock.stock += 1;
          }
        } else {
          state.cart = state.cart.filter(
            (product) => product.id !== action.payload
          );
          const productInStock = state.products.find(
            (product) => product.id === action.payload
          );
          if (productInStock){
            productInStock.stock += 1;
          }
        }
      }
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.map((product) => ({
          ...product,
          stock : product.stock || 10,
        }))
        state.status = "succeeded"
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
       
      });
  },
});

export const selectTotalPrice = createSelector(
  [(state) => state.cart.cart],
  (cart) => cart.reduce((total, item) => total + item.price * item.quantity, 0)
);

export const {
  addToCart,
  removeFromCart,
  decrementItem,
  incrementItem,
  setCategory
} = cartSlice.actions;
export default cartSlice.reducer;