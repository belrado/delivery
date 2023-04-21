import { combineReducers } from '@reduxjs/toolkit';
import userSlice from '../slices/user';
import commonSlice from '../slices/common';
import orderSlice from '../slices/order';

const rootReducer = combineReducers({
    common: commonSlice.reducer,
    user: userSlice.reducer,
    order: orderSlice.reducer,
});
//export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
