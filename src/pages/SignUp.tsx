import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SignUpScreenProps } from '../types/navigations';
import DismissKeyboardView from '../components/DismissKeyboardView';
import LabelInput from '../components/LabelInput';
import useSignUp from '../hooks/useSignUp';

export function SignUp({}: SignUpScreenProps) {
    const {
        email,
        name,
        password,
        emailRef,
        nameRef,
        passwordRef,
        handleSubmit,
        handleChange,
    } = useSignUp();
    const canGoNext = email && name && password;

    return (
        <DismissKeyboardView>
            <LabelInput
                label="Email"
                onChangeText={text => handleChange('email', text)}
                placeholder="이메일을 입력해주세요"
                placeholderTextColor="#666"
                textContentType="emailAddress"
                value={email}
                returnKeyType="next"
                clearButtonMode="while-editing"
                inputRef={emailRef}
                onSubmitEditing={() => nameRef.current?.focus()}
                blurOnSubmit={false}
            />
            <LabelInput
                label="NickName"
                placeholder="이름을 입력해주세요."
                placeholderTextColor="#666"
                onChangeText={text => handleChange('name', text)}
                value={name}
                textContentType="name"
                returnKeyType="next"
                clearButtonMode="while-editing"
                inputRef={nameRef}
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
            />
            <LabelInput
                label="Password"
                placeholder="비밀번호를 입력해주세요(영문,숫자,특수문자)"
                placeholderTextColor="#666"
                onChangeText={text => handleChange('password', text)}
                value={password}
                keyboardType={
                    Platform.OS === 'android' ? 'default' : 'ascii-capable'
                }
                textContentType="password"
                secureTextEntry
                returnKeyType="send"
                clearButtonMode="while-editing"
                inputRef={passwordRef}
                onSubmitEditing={handleSubmit}
            />

            <View style={styles.buttonSection}>
                <Pressable
                    style={
                        canGoNext
                            ? StyleSheet.compose(
                                  styles.loginButton,
                                  styles.loginButtonActive,
                              )
                            : styles.loginButton
                    }
                    disabled={!canGoNext}
                    onPress={handleSubmit}>
                    <Text style={styles.loginButtonText}>회원가입</Text>
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
