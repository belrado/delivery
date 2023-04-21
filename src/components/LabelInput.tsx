import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TextInputProps,
} from 'react-native';

interface LabelInputParams extends TextInputProps {
    label: string;
    inputRef?: React.RefObject<TextInput>;
}

function LabelInput({ label, inputRef, ...props }: LabelInputParams) {
    return (
        <View style={styles.inputSection}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={styles.textInput} {...props} ref={inputRef} />
        </View>
    );
}

export default LabelInput;

const styles = StyleSheet.create({
    inputSection: {
        padding: 20,
    },
    textInput: {
        padding: 5,
        marginBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },
});
