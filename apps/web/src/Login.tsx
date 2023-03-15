import React, { useEffect } from 'react';
import User from 'common/objects/User';
import { Button } from 'ui';
import { Text } from 'react-native';

const Login: React.FC = () => {
    const user = new User();

    const handleSetDate = async () => {
        await user.test();
    };

    const handleAuthorizeGoogle = async () => {
        const response = await user.authorizeGmail();
        window.open(response.data.authorizationUrl);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.append(script);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
                id="g_id_onload"
                data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                data-login_uri={`${import.meta.env.VITE_API_BASE_URL}/login`}
                data-auto_prompt="false"
            ></div>
            <div
                className="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left"
            ></div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Button onPress={handleSetDate}>
                    <Text>Set Date</Text>
                </Button>
                <Button onPress={handleAuthorizeGoogle}>
                    <Text>Authorize Google API</Text>
                </Button>
            </div>
        </div>
    );
};

export default Login;
