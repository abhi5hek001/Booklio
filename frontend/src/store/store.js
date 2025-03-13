import { configureStore } from "@reduxjs/toolkit";

import authReducer from './authSlice/user'
import adminAuthReducer from './authSlice/admin'
import sellerAuthReducer from './authSlice/seller/'

import sellerReducer from './sellerSlice'
import adminReducer from './adminSlice' // Import the new admin slice

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        adminAuth: adminAuthReducer,
        sellerAuth: sellerAuthReducer,

        seller: sellerReducer,
        adminReducer, 

        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,
    },
});

export default store;