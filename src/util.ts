import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import Config from 'react-native-config';
import { CustomAxiosInstance } from './types/axios';

import store, { RootState } from './store/store';
import EncryptedStorage from 'react-native-encrypted-storage';
import { setAccessToken } from './slices/user';

export function getDistanceFromLatLonInKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export const instance: AxiosInstance = axios.create({
    baseURL: Config.API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use((req: InternalAxiosRequestConfig) => {
    req.headers.authorization = 'haha';
    return req;
});

export const logOnDev = (message: string) => {
    if (__DEV__) {
        console.log(message);
    }
};

const handleRequest = (
    config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
    const { method, url } = config;
    const state: RootState = store.getState();
    logOnDev(`[API] ${method?.toUpperCase()} ${url} | Request`);
    logOnDev(`[API] ${config.headers.authorization} ${url} | Request`);
    if (!config.headers.authorization) {
        config.headers.authorization = `Bearer ${state.user.accessToken ?? ''}`;
    }
    logOnDev(`[API] ${config.headers.authorization} ${url} | Request`);

    return config;
};

const handleResponse = <T, D>(response: AxiosResponse): AxiosResponse<T, D> => {
    const { method, url } = response.config;
    const { status } = response;
    logOnDev(`[API] ${method?.toUpperCase()} ${url} | Response ${status}`);
    response.data.refreshToken;
    return response.data.data;
};

const handleErrorResponse = async (error: AxiosError | Error) => {
    if (axios.isAxiosError(error)) {
        const { message } = error;
        const { method, url } = error.config as InternalAxiosRequestConfig;
        if (error.response) {
            const { status, data } = error.response as AxiosResponse;
            logOnDev(
                `[API] ${method}, ${url} | Error ${status} ${data.message} | ${message}`,
            );
            if (status === 419 && data.code === 'expired') {
                logOnDev(`[API] ${method} ${url} | RefreshToken request`);
                const originalConfig = error.config as AxiosResponse;
                const refreshToken = await EncryptedStorage.getItem(
                    'refreshToken',
                );
                try {
                    const refreshTokenResponse = await client.post<{
                        email: string;
                        name: string;
                        accessToken: string;
                    }>(
                        `${Config.API_URL}/refreshToken`,
                        {},
                        {
                            headers: {
                                authorization: `Bearer ${refreshToken}`,
                            },
                        },
                    );
                    store.dispatch(
                        setAccessToken(refreshTokenResponse.accessToken),
                    );
                    originalConfig.headers.authorization =
                        refreshTokenResponse.accessToken;
                    return axios(originalConfig);
                } catch (e) {
                    return Promise.reject(e);
                }
            } else {
                return Promise.reject(error);
            }
        } else {
            logOnDev(`[API] ${method}, ${url} | Error | ${message}`);
        }
    } else {
        logOnDev(`[API] | Error ${error.message}`);
    }
    return Promise.reject(error);
};

export const client: CustomAxiosInstance = axios.create({
    baseURL: Config.API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(handleRequest);
client.interceptors.response.use(handleResponse, handleErrorResponse);
