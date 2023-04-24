import React, { useState, useEffect } from 'react';
import { Button } from 'ui';

type LoginProps = {
    onLogin: () => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleGetLoginState = async () => {
        try {
            const response = await chrome.runtime.sendMessage({ type: 'GET_LOGIN_STATE' });
            if (response.data.isLoggedIn) {
                onLogin();
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleGetLoginState();
    }, []);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        const response = await chrome.runtime.sendMessage({ type: 'LOGIN' });
        if (response.message === 'ok') {
            onLogin();
        } else {
            console.error(response.message);
        }
        setIsLoggingIn(false);
    };

    if (isLoading) return null;

    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                padding: 20,
                flexDirection: 'column',
            }}
        >
            <Button title="Continue with Google" onPress={handleLogin} isLoading={isLoggingIn} />
        </div>
    );
};

export default Login;
