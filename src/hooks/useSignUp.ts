import useInput from './useInput';
import { useCallback, useRef } from 'react';
import { Alert, TextInput } from 'react-native';
import useAuth from './useAuth';
import { responseStatus, SignUpParams } from '../types/common';
import { AxiosError, isAxiosError } from 'axios';
import { setLoading } from '../store/actions';
import Config from 'react-native-config';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../types/navigations';
import { client } from '../util';

function useSignUp() {
    const [{ email, name, password }, handleChange] = useInput<SignUpParams>({
        email: '',
        name: '',
        password: '',
    });
    const navigation = useNavigation<NavigationProps<'SignIn'>>();
    const emailRef = useRef<TextInput | null>(null);
    const nameRef = useRef<TextInput | null>(null);
    const passwordRef = useRef<TextInput | null>(null);
    const { alert, checkName, checkEmail, checkPasswd } = useAuth();

    const handleSubmit = useCallback(async () => {
        const validateEmail: responseStatus = checkEmail(email);
        const validateName: responseStatus = checkName(name);
        const validatePasswd: responseStatus = checkPasswd(password);

        if (validateEmail.error) {
            alert({ title: '알림', message: validateEmail.message });
            emailRef.current?.focus();
            return;
        }
        if (validateName.error) {
            alert({ title: '알림', message: validateName.message });
            nameRef.current?.focus();
            return;
        }
        if (validatePasswd.error) {
            alert({ title: '알림1', message: validatePasswd.message });
            passwordRef.current?.focus();
            return;
        }

        try {
            setLoading(true);
            await client.post(Config.API_URL + '/user', {
                email,
                name,
                password,
            });
        } catch (error) {
            if (isAxiosError(error)) {
                const errorResponse: any = (error as AxiosError).response;
                Alert.alert('알림', errorResponse.data.message);
            }
        } finally {
            navigation.navigate('SignIn');
            setLoading(false);
        }
    }, [alert, checkEmail, checkName, checkPasswd, email, name, password]);

    return {
        email,
        name,
        password,
        emailRef,
        nameRef,
        passwordRef,
        handleSubmit,
        handleChange,
    };
}

export default useSignUp;
