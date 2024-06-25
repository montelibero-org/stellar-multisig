// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import netReducer from './netSlice';

const store = configureStore({
    reducer: {
        net: netReducer,
    },
});

export default store;
