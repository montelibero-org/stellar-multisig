// redux/netSlice.js
import { createSlice } from '@reduxjs/toolkit';

const netSlice = createSlice({
    name: 'net',
    initialState: 'public',
    reducers: {
        setNet: (state, action) => action.payload,
    },
});

export const { setNet } = netSlice.actions;

export default netSlice.reducer;
