import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { CompositeScreenProps, NavigationProp } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type NavigationProps<T extends keyof RootStackParamList> =
    NativeStackNavigationProp<RootStackParamList, T>;

export type SignInScreenProps = RootStackScreenProps<'SignIn'>;
export type SignUpScreenProps = RootStackScreenProps<'SignUp'>;

export type LoggedInNavigation = NativeStackNavigationProp<LoggedInParamList>;

export type LoggedInParamList = {
    Orders: undefined;
    Settings: undefined;
    Delivery: undefined;
    Complete: { orderId: string };
};

export type DeliveryParamList = {
    Complete: { orderId: string };
    Ing: undefined;
};

export type DeliveryStackScreenProps<T extends keyof DeliveryParamList> =
    NativeStackScreenProps<DeliveryParamList, T>;

export type HomeTabScreenProps<T extends keyof LoggedInParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<LoggedInParamList, T>,
        RootStackScreenProps<keyof RootStackParamList>
    >;
