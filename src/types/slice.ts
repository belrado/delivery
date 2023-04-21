export interface CommonState {
    loading: boolean;
}

export interface UserState {
    name: string;
    email: string;
    accessToken: string;
    money: number;
}

export interface OrderState {
    orders: OrderParams[];
    deliveries: OrderParams[];
}

export interface OrderParams {
    orderId: string;
    start: {
        latitude: number;
        longitude: number;
    };
    end: {
        latitude: number;
        longitude: number;
    };
    price: number;
}
