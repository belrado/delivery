import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { HomeTabScreenProps } from '../types/navigations';
import { useAppDispatch, useAppSelector } from '../hooks/common';
import { RootState } from '../store/reducer';
import { setLoading } from '../store/actions';
import { AxiosError, isAxiosError } from 'axios';
import Config from 'react-native-config';
import useAuth from '../hooks/useAuth';
import { setMoney, setUser } from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import { shallowEqual } from 'react-redux';
import { client } from '../util';

export function Settings({ navigation }: HomeTabScreenProps<'Settings'>) {
    const { name, money, accessToken } = useAppSelector(
        (state: RootState) => state.user,
        shallowEqual,
    );
    const { alert } = useAuth();
    const dispatch = useAppDispatch();

    useEffect(() => {
        async function getMoney() {
            try {
                const response = await client.get<number>(
                    `${Config.API_URL}/showmethemoney`,
                );
                return response;
            } catch (error) {
                throw error;
            }
        }
        getMoney()
            .then(data => {
                dispatch(setMoney(data));
            })
            .catch(error => {
                if (isAxiosError(error)) {
                    const errorResponse: any = (error as AxiosError).response;
                    alert({
                        title: '안내',
                        message: errorResponse.data.message,
                    });
                }
            });
    }, [accessToken, alert, dispatch]);

    const handleLogout = useCallback(async () => {
        console.log(accessToken);
        try {
            dispatch(setLoading(true));
            await client.post(`${Config.API_URL}/logout`, {});
            alert({ title: '안내', message: '로그아웃 되었습니다.' });
            dispatch(setUser({ email: '', name: '', accessToken: '' }));
            await EncryptedStorage.removeItem('refreshToken');
        } catch (error) {
            const errorResponse = (error as AxiosError).response;
            console.error(errorResponse);
        } finally {
            dispatch(setLoading(false));
        }
    }, [accessToken]);

    return (
        <View style={styles.container}>
            <View style={styles.money}>
                <Text style={styles.moneyText}>
                    {name} 님의 수익금{' '}
                    <Text>
                        {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    </Text>
                    원
                </Text>
            </View>
            <View style={styles.buttonZone}>
                <Pressable
                    style={[styles.loginButton, styles.loginButtonActive]}
                    onPress={handleLogout}>
                    <Text style={styles.loginButtonText}>로그아웃</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    money: {
        padding: 20,
    },
    moneyText: {
        fontSize: 16,
    },
    buttonZone: {
        alignItems: 'center',
        paddingTop: 20,
    },
    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    loginButtonActive: {
        backgroundColor: 'blue',
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
