import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
    Keyboard,
    StyleProp,
    TouchableWithoutFeedback,
    ViewStyle,
} from 'react-native';

interface DismissKeyboardViewParams {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

function DismissKeyboardView({
    children,
    ...props
}: DismissKeyboardViewParams) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAwareScrollView {...props} style={props.style}>
                {children}
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

export default DismissKeyboardView;
