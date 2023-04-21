import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import { DeliveryStackScreenProps } from '../types/navigations';

export function Ing({ navigation }: DeliveryStackScreenProps<'Ing'>) {
    return (
        <SafeAreaView>
            <Text>Ing</Text>
        </SafeAreaView>
    );
}
