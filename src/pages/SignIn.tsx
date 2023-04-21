import React, { useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SignInScreenProps } from '../types/navigations';
import DismissKeyboardView from '../components/DismissKeyboardView';
import LabelInput from '../components/LabelInput';
import useSignIn from '../hooks/useSignIn';

export function SignIn({ navigation }: SignInScreenProps) {
    const emailRef = useRef<TextInput | null>(null);
    const passwdRef = useRef<TextInput | null>(null);

    const { email, password, handleChange, handleSubmit, handleGoSignUp } =
        useSignIn();

    const canGoNext = email && password;

    return (
        <DismissKeyboardView>
            <LabelInput
                label="Email"
                value={email}
                placeholder="이메일을 입력해주세요"
                onChangeText={text => handleChange('email', text)}
                importantForAutofill="yes"
                autoComplete="email"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => {
                    passwdRef.current?.focus();
                }}
                blurOnSubmit={false}
                inputRef={emailRef}
                clearButtonMode={'while-editing'}
            />
            <LabelInput
                label="Passwd"
                value={password}
                placeholder="비밀번호를 입력해주세요"
                onChangeText={text => handleChange('password', text)}
                secureTextEntry={true}
                autoComplete="sms-otp"
                inputRef={passwdRef}
                onSubmitEditing={handleSubmit}
            />

            <View style={styles.buttonSection}>
                <Pressable
                    onPress={handleSubmit}
                    style={
                        !canGoNext
                            ? styles.loginButton
                            : [styles.loginButton, styles.loginButtonActive]
                    }
                    disabled={!canGoNext}>
                    <Text style={styles.loginButtonText}>로그인</Text>
                </Pressable>
                <Pressable
                    onPress={handleGoSignUp}
                    style={{ marginBottom: 50 }}>
                    <Text>회원가입하기</Text>
                </Pressable>
            </View>
        </DismissKeyboardView>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
        marginBottom: 20,
    },
    loginButtonActive: {
        backgroundColor: 'blue',
    },
    loginButtonText: {
        color: 'white',
    },
    buttonSection: {
        alignItems: 'center',
    },
});
