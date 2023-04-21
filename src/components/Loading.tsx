import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { LoadingParams } from '../types/common';
function Loading({ color, size = 'large' }: LoadingParams) {
    const loadingColor = color ?? 'rgb(99, 53, 180)';
    return (
        <View style={styles.container}>
            <ActivityIndicator color={loadingColor} size={size} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
});

export default Loading;
