import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { HomeTabScreenProps } from '../types/navigations';
import { useAppSelector } from '../hooks/common';
import { RootState } from '../store/reducer';
import { OrderParams } from '../types/slice';
import EachOrder from '../components/EachOrder';

export function Orders({ navigation }: HomeTabScreenProps<'Orders'>) {
    const orders = useAppSelector((state: RootState) => state.order.orders);
    const renderItem = useCallback(({ item }: { item: OrderParams }) => {
        return <EachOrder item={item} />;
    }, []);
    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.orderId}
            renderItem={renderItem}
        />
    );
}
