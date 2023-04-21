import { useCallback } from 'react';
import useInput from './useInput';
import useAuth from './useAuth';
import { responseStatus, SignInParams } from '../types/common';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigations';
import { useAppDispatch } from './common';
import { setLoading } from '../store/actions';
import axios, { AxiosError, isAxiosError } from 'axios';
import Config from 'react-native-config';
import { setUser } from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import { client } from '../util';

function useSignIn() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProps<'SignUp'>>();
    const [{ email, password }, handleChange] = useInput<SignInParams>({
        email: '',
        password: '',
    });
    const { alert, checkEmail, checkPasswd } = useAuth();

    const handleSubmit = useCallback(async () => {
        const validateEmail: responseStatus = checkEmail(email);
        const validatePasswd: responseStatus = checkPasswd(password);
        const errorMessage: string =
            '아이디 또는 비밀번호가 일치하지 않습니다.';
        if (validateEmail.error || validatePasswd.error) {
            alert({ title: '안내', message: errorMessage });
            return;
        }

        try {
            setLoading(true);
            const response = await client.post<{
                name: string;
                email: string;
                accessToken: string;
                refreshToken: string;
            }>(Config.API_URL + '/login', {
                email,
                password,
            });
            alert({ title: '안내', message: '로그인 되었습니다.' });
            console.log(response);
            dispatch(
                setUser({
                    name: response.name,
                    email: response.email,
                    accessToken: response.accessToken,
                }),
            );
            await EncryptedStorage.setItem(
                'refreshToken',
                response.refreshToken,
            );
        } catch (error) {
            if (isAxiosError(error)) {
                const errorResponse: any = (error as AxiosError).response;
                alert({ title: '안내', message: errorResponse.data.message });
            }
        } finally {
            setLoading(false);
        }
    }, [alert, checkEmail, checkPasswd, email, password]);

    const handleGoSignUp = useCallback(() => {
        navigation.navigate('SignUp');
    }, [navigation]);

    return { email, password, handleChange, handleSubmit, handleGoSignUp };
}

export default useSignIn;
