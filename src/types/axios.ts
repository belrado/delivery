import {
    AxiosInstance,
    AxiosInterceptorManager,
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
    getUri(config?: InternalAxiosRequestConfig): string;
    request<T>(config: InternalAxiosRequestConfig): Promise<T>;
    get<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    head<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    options<T>(url: string, config?: InternalAxiosRequestConfig): Promise<T>;
    post<T>(
        url: string,
        data?: any,
        config?: InternalAxiosRequestConfig,
    ): Promise<T>;
    put<T>(
        url: string,
        data?: any,
        config?: InternalAxiosRequestConfig,
    ): Promise<T>;
    patch<T>(
        url: string,
        data?: any,
        config?: InternalAxiosRequestConfig,
    ): Promise<T>;
}
