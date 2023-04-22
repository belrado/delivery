import {
    AxiosInstance,
    AxiosInterceptorManager,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

export type CustomResponseFormat<T = any> = {
    response: T;
    refreshToken?: string;
};
export interface CustomAxiosInstance extends AxiosInstance {
    interceptors: {
        request: AxiosInterceptorManager<InternalAxiosRequestConfig>;
        response: AxiosInterceptorManager<AxiosResponse<CustomResponseFormat>>;
    };
    getUri(config?: AxiosRequestConfig): string;
    request<T>(config: AxiosRequestConfig): Promise<T>;
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}
