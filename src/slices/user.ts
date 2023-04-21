import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState } from '../types/slice';

const initialState: UserState = {
    name: '',
    email: '',
    accessToken: '',
    money: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(
            state,
            action: PayloadAction<{
                email: string;
                name: string;
                accessToken: string;
            }>,
        ) {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.accessToken = action.payload.accessToken;
        },
        setMoney(state, action: PayloadAction<number>) {
            state.money = action.payload;
        },
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload;
        },
    },
    extraReducers: builder => {},
});

export const { setUser, setMoney, setAccessToken } = userSlice.actions;

export default userSlice;
