import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Pressable, Text, Dimensions } from 'react-native';
import { OrderParams } from '../types/slice';
import { useNavigation } from '@react-navigation/native';
import { LoggedInNavigation } from '../types/navigations';
import { useAppDispatch, useAppSelector } from '../hooks/common';
import { RootState } from '../store/reducer';
import { AxiosError, isAxiosError } from 'axios';
import Config from 'react-native-config';
import useAuth from '../hooks/useAuth';
import { acceptOrder, rejectOrder } from '../slices/order';
import { client, getDistanceFromLatLonInKm } from '../util';
import { setLoading } from '../store/actions';
import NaverMapView, { Marker, Path } from 'react-native-nmap/index';

interface Props {
    item: OrderParams;
}

function EachOrder({ item }: Props) {
    const navigation = useNavigation<LoggedInNavigation>();
    const dispatch = useAppDispatch();
    const accessToken = useAppSelector(
        (state: RootState) => state.user.accessToken,
    );
    const [detail, showDetail] = useState<boolean>(false);
    const { alert } = useAuth();

    const handleOnAccept = useCallback(async () => {
        if (!accessToken) {
            return;
        }
        try {
            dispatch(setLoading(true));
            await client.post(`${Config.API_URL}/accept`, {
                orderId: item.orderId,
            });
            dispatch(acceptOrder(item.orderId));
            navigation.navigate('Delivery');
        } catch (e) {
            if (isAxiosError(e)) {
                let errorResponse: any = (e as AxiosError).response;
                if (errorResponse?.status === 400) {
                    alert({
                        title: '안내',
                        message: errorResponse.data?.message,
                    });
                    dispatch(rejectOrder(item.orderId));
                }
            }
        } finally {
            dispatch(setLoading(false));
        }
    }, [accessToken, alert, dispatch, item.orderId, navigation]);

    const handleOnReject = useCallback(() => {
        dispatch(rejectOrder(item.orderId));
    }, [dispatch, item.orderId]);

    const { start, end } = item;

    const toggleDetail = useCallback(() => {
        showDetail(prevState => !prevState);
    }, []);

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <View style={styles.orderContainer}>
            <Pressable onPress={toggleDetail} style={styles.info}>
                <Text style={styles.eachInfo}>
                    {item.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    원
                </Text>
                <Text style={styles.eachInfo}>
                    {getDistanceFromLatLonInKm(
                        start.latitude,
                        start.longitude,
                        end.latitude,
                        end.longitude,
                    ).toFixed(1)}
                    km
                </Text>
            </Pressable>
            {detail && (
                <View>
                    <View
                        style={{
                            width: Dimensions.get('window').width - 30,
                            height: 200,
                            marginVertical: 10,
                        }}>
                        {/* @ts-ignore */}
                        <NaverMapView
                            style={{ width: '100%', height: '100%' }}
                            zoomControl={false}
                            center={{
                                zoom: 10,
                                tilt: 50,
                                latitude: (start.latitude + end.latitude) / 2,
                                longitude:
                                    (start.longitude + end.longitude) / 2,
                            }}>
                            <Marker
                                coordinate={{
                                    latitude: start.latitude,
                                    longitude: start.longitude,
                                }}
                                pinColor="blue"
                            />
                            <Path
                                coordinates={[
                                    {
                                        latitude: start.latitude,
                                        longitude: start.longitude,
                                    },
                                    {
                                        latitude: end.latitude,
                                        longitude: end.longitude,
                                    },
                                ]}
                            />
                            <Marker
                                coordinate={{
                                    latitude: end.latitude,
                                    longitude: end.longitude,
                                }}
                            />
                        </NaverMapView>
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Pressable
                            onPress={handleOnAccept}
                            style={styles.acceptButton}>
                            <Text style={styles.buttonText}>수락</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleOnReject}
                            style={styles.rejectButton}>
                            <Text style={styles.buttonText}>거절</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    orderContainer: {
        borderRadius: 5,
        margin: 5,
        padding: 10,
        backgroundColor: 'lightgray',
    },
    info: {
        flexDirection: 'row',
    },
    eachInfo: {
        flex: 1,
    },
    buttonWrapper: {
        flexDirection: 'row',
    },
    acceptButton: {
        backgroundColor: 'blue',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
        flex: 1,
    },
    rejectButton: {
        backgroundColor: 'red',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default EachOrder;
