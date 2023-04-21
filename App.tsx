/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { LoggedInParamList, RootStackParamList } from './src/types/navigations';
import { SignUp } from './src/pages/SignUp';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Orders } from './src/pages/Orders';
import { SignIn } from './src/pages/SignIn';
import { Delivery } from './src/pages/Delivery';
import { Settings } from './src/pages/Settings';
import { useAppDispatch, useAppSelector } from './src/hooks/common';
import Loading from './src/components/Loading';
import useSocket from './src/hooks/useSocket';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, { AxiosError, AxiosResponse, isAxiosError } from 'axios';
import useAuth from './src/hooks/useAuth';
import Config from 'react-native-config';
import { setUser } from './src/slices/user';
import { OrderParams } from './src/types/slice';
import { addOrder } from './src/slices/order';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<LoggedInParamList>();

function App() {
    const isLoggedIn = useAppSelector(state => !!state.user.email);
    const loading = useAppSelector(state => state.common.loading);
    const [socket, disconnect] = useSocket();
    const { alert } = useAuth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const getRefreshToken = async () => {
            try {
                const refreshToken = await EncryptedStorage.getItem(
                    'refreshToken',
                );
                if (!refreshToken) {
                    return;
                }
                const response: AxiosResponse<any, any> = await axios.post(
                    `${Config.API_URL}/refreshToken`,
                    {},
                    {
                        headers: {
                            authorization: `Bearer ${refreshToken}`,
                        },
                    },
                );
                return response.data.data;
            } catch (error: any) {
                throw error;
            }
        };
        getRefreshToken()
            .then(data => {
                console.log(data);
                dispatch(
                    setUser({
                        email: data.email,
                        name: data.name,
                        accessToken: data.accessToken,
                    }),
                );
            })
            .catch((error: any) => {
                console.log(error, typeof error);
                if (isAxiosError(error)) {
                    const errorResponse: any = (error as AxiosError).response;
                    if (errorResponse?.data?.code === 'expired') {
                        alert({
                            title: '안내',
                            message: '다시 로그인 해주세요.',
                        });
                    }
                }
            })
            .finally(() => {
                console.log('splash end');
            });
    }, [dispatch]);

    useEffect(() => {
        const callback = (data: OrderParams) => {
            console.log(data);
            dispatch(addOrder(data));
        };
        if (socket && isLoggedIn) {
            console.log('connectSocket', socket);
            socket.emit('acceptOrder', 'hello');
            socket.on('order', callback);
        }
        return () => {
            if (socket) {
                socket.off('order', callback);
            }
        };
    }, [dispatch, isLoggedIn, socket]);

    useEffect(() => {
        console.log('useEffect isLoggedIn check');
        if (!isLoggedIn) {
            console.log('!isLoggedIn', isLoggedIn);
            disconnect();
        }
    }, [isLoggedIn, disconnect]);

    return (
        <NavigationContainer>
            {isLoggedIn ? (
                <Tab.Navigator>
                    <Tab.Screen
                        name="Orders"
                        component={Orders}
                        options={{ title: 'Order List' }}
                    />
                    <Tab.Screen
                        name="Delivery"
                        component={Delivery}
                        options={{ headerShown: false }}
                    />
                    <Tab.Screen
                        name="Settings"
                        component={Settings}
                        options={{ title: 'My Page' }}
                    />
                </Tab.Navigator>
            ) : (
                <Stack.Navigator>
                    <Stack.Screen
                        name="SignIn"
                        component={SignIn}
                        options={{ title: 'Sign In' }}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUp}
                        options={{ title: 'Sign Up' }}
                    />
                </Stack.Navigator>
            )}
            {loading && <Loading />}
        </NavigationContainer>
    );
}

export default App;
