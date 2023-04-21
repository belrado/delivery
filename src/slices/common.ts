import { CommonState } from '../types/slice';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CommonState = {
    loading: false,
};

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
    extraReducers: builder => {},
});

export default commonSlice;
