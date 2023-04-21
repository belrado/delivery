export interface responseStatus {
    error: boolean;
    message: string;
}

export interface SignInParams {
    email: string;
    password: string;
}

export interface SignUpParams extends SignInParams {
    name: string;
}

export interface LoadingParams {
    color?: string;
    size?: number | 'large' | 'small';
}
