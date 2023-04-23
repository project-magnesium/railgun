import React, { useEffect } from 'react';
import { UserInterface } from 'common';
import { H1 } from 'ui';

const Login: React.FC = () => {
    const userInterface = new UserInterface();

    const handleAuthorizeGoogle = async () => {
        const response = await userInterface.authorizeGmail();
        window.open(response.data.authorizationUrl);
    };

    const handleGmailUnsubscribe = async () => {
        await userInterface.gmailUnsubscribe();
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.append(script);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20 }}>
            <H1>Welcome to Railgun!</H1>
            <div
                id="g_id_onload"
                data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                data-login_uri={`${import.meta.env.VITE_API_BASE_URL}/login`}
                data-auto_prompt="true"
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
            <button onClick={handleAuthorizeGoogle}>Authorize Gmail</button>
            <button onClick={handleGmailUnsubscribe}>Unsubscribe Gmail</button>
        </div>
    );
};

export default Login;
