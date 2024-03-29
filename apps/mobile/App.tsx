import React, { useEffect, useState } from 'react';
import CookieManager from '@react-native-cookies/cookies';
import { SafeAreaView, Platform, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

import { trpcConfig } from 'common';
import { Button, Provider, Text, theme } from 'ui';
import { VITE_GOOGLE_IOS_CLIENT_ID, VITE_GOOGLE_ANDROID_CLIENT_ID, VITE_DOMAIN_NAME, VITE_API_BASE_URL } from '@env';

WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator();
const androidClientId = VITE_GOOGLE_ANDROID_CLIENT_ID;
const iosClientId = VITE_GOOGLE_IOS_CLIENT_ID;

const setCookie = async (idToken: string) => {
    const isLocal = VITE_DOMAIN_NAME.includes('localhost');

    try {
        const newCookie = {
            httpOnly: true,
            domain: isLocal ? 'localhost' : `.${VITE_DOMAIN_NAME}`,
            secure: !isLocal,
            name: 'cred',
            value: idToken,
        };

        await CookieManager.set(VITE_API_BASE_URL, newCookie);
    } catch (e) {
        console.log(e);
    }
};

const handleSetCredentials = async (idToken: string | undefined, refreshToken: string | undefined) => {
    if (idToken) await setCookie(idToken);
    if (refreshToken) await SecureStore.setItemAsync('refreshToken', refreshToken);
};

type LoginProps = {
    onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId,
        iosClientId,
        responseType: 'id_token',
    });

    const handleLoginSuccess = async (idToken: string, refreshToken: string | undefined) => {
        await handleSetCredentials(idToken, refreshToken);

        onLogin();
    };

    useEffect(() => {
        if (response?.type === 'success' && response.authentication && response.authentication.idToken) {
            handleLoginSuccess(response.authentication.idToken, response.authentication.refreshToken);
        }
    }, [request, response]);

    return (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}
        >
            <Button
                isDisabled={!request}
                onPress={() => {
                    promptAsync();
                }}
                title="Sign in with Google"
                extraStyle={{ alignSelf: 'auto' }}
            />
        </View>
    );
};

const StackNavigator = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        trpcConfig.set({
            baseURL: VITE_API_BASE_URL,
            handleLogin: async () => {
                try {
                    const refreshToken = (await SecureStore.getItemAsync('refreshToken')) ?? undefined;
                    const refreshResponse = await AuthSession.refreshAsync(
                        { refreshToken: refreshToken, clientId: Platform.OS === 'ios' ? iosClientId : androidClientId },
                        Google.discovery
                    );
                    await handleSetCredentials(refreshResponse.idToken, undefined);

                    return true;
                } catch (e) {
                    console.log(e);
                }

                navigation.navigate('login');
                return false;
            },
        });
    }, []);

    const handleCheckLoggedIn = async () => {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) setIsLoggedIn(true);
    };

    useEffect(() => {
        handleCheckLoggedIn();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {isLoggedIn ? (
                <Stack.Screen name="home">
                    {() => (
                        <Provider>
                            <Text>Home</Text>
                        </Provider>
                    )}
                </Stack.Screen>
            ) : (
                <Stack.Screen name="login">
                    {() => (
                        <Provider>
                            <Login onLogin={handleLogin} />
                        </Provider>
                    )}
                </Stack.Screen>
            )}
        </Stack.Navigator>
    );
};

export default function App() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.palette.background.default }}>
            <NavigationContainer theme={{ colors: { background: theme.palette.background.default } }}>
                <StackNavigator />
            </NavigationContainer>
        </SafeAreaView>
    );
}
