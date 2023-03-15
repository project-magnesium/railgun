import React from 'react';
import CookieManager from '@react-native-cookies/cookies';
import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'ui';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import User from 'common/objects/User';
import { VITE_GOOGLE_IOS_CLIENT_ID, VITE_GOOGLE_ANDROID_CLIENT_ID, VITE_DOMAIN_NAME, VITE_API_BASE_URL } from '@env';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
    const androidClientId = VITE_GOOGLE_ANDROID_CLIENT_ID;
    const iosClientId = VITE_GOOGLE_IOS_CLIENT_ID;
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        androidClientId,
        iosClientId,
        responseType: 'id_token',
    });
    const user = new User();

    useEffect(() => {
        if (response?.type === 'success' && response.authentication && response.authentication.idToken) {
            setCookie(response.authentication.idToken);
        }
    }, [request, response]);

    const setCookie = async (idToken: string) => {
        try {
            const newCookie = {
                httpOnly: true,
                domain: `.${VITE_DOMAIN_NAME}`,
                secure: true,
                name: 'cred',
                value: idToken,
                url: VITE_API_BASE_URL,
            };

            await CookieManager.set(`https://www.${VITE_DOMAIN_NAME}`, newCookie);
        } catch (e) {
            console.log(e);
        }
    };

    const handleTest = async () => {
        await user.test();
    };

    return (
        <View style={styles.container}>
            <Button
                disabled={!request}
                onPress={() => {
                    promptAsync();
                }}
            >
                <Text>Sign in with Google</Text>
            </Button>
            <Button disabled={!request} onPress={handleTest}>
                <Text>Set Date</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
