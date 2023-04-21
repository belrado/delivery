import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { DeliveryStackScreenProps } from '../types/navigations';

export function Complete({
    navigation,
    route,
}: DeliveryStackScreenProps<'Complete'>) {
    return (
        <SafeAreaView>
            <Text>Complete</Text>
        </SafeAreaView>
    );
}
