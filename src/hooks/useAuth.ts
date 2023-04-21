import { useCallback } from 'react';
import { Alert } from 'react-native';
import { responseStatus } from '../types/common';

interface alertParams {
    title: string;
    message: string;
}

export default function useAuth(): {
    alert: ({ title, message }: alertParams) => void;
    checkEmail: (email: string) => responseStatus;
    checkName: (name: string) => responseStatus;
    checkPasswd: (password: string) => responseStatus;
} {
    const alert = useCallback(({ title = '안내', message }: alertParams) => {
        const sendMessage: string = message !== '' ? message : '오류';
        Alert.alert(title, sendMessage);
    }, []);

    const checkEmail = useCallback((email: string) => {
        let response: responseStatus = { error: false, message: '' };
        if (!email || !email.trim()) {
            response.error = true;
            response.message = '이메일을 입력해주세요.';
        } else if (
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
                email,
            )
        ) {
            response.error = true;
            response.message = '올바른 이메일 주소가 아닙니다.';
        }
        return response;
    }, []);

    const checkName = useCallback((name: string) => {
        let response: responseStatus = { error: false, message: '' };
        if (!name || !name.trim()) {
            response.error = true;
            response.message = '이름을 입력해주세요.';
        }
        return response;
    }, []);

    const checkPasswd = useCallback((password: string) => {
        let response: responseStatus = { error: false, message: '' };
        if (!password || !password.trim()) {
            response.error = true;
            response.message = '비밀번호를 입력해주세요.';
        } else if (
            !/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(
                password,
            )
        ) {
            response.error = true;
            response.message =
                '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.';
        }
        return response;
    }, []);

    return {
        alert,
        checkEmail,
        checkName,
        checkPasswd,
    };
}
