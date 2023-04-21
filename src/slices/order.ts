import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderParams, OrderState } from '../types/slice';

const initialState: OrderState = {
    orders: [],
    deliveries: [],
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action: PayloadAction<OrderParams>) {
            state.orders.push(action.payload);
        },
        acceptOrder(state, action: PayloadAction<string>) {
            const index = state.orders.findIndex(
                v => v.orderId === action.payload,
            );

            if (index > -1) {
                state.deliveries.push(state.orders[index]);
                state.orders.splice(index, 1);
            }
        },
        rejectOrder(state, action: PayloadAction<string>) {
            const index = state.orders.findIndex(
                v => v.orderId === action.payload,
            );

            if (index > -1) {
                state.orders.splice(index, 1);
            }

            const deliveriesIndex = state.deliveries.findIndex(
                v => v.orderId === action.payload,
            );

            if (index > -1) {
                state.deliveries.splice(deliveriesIndex, 1);
            }
        },
    },
    extraReducers: builder => {},
});

export const { addOrder, acceptOrder, rejectOrder } = orderSlice.actions;

export default orderSlice;
