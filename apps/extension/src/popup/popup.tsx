import React from 'react';
import ReactDOM from 'react-dom/client';
import PopupApp from './PopupApp';
import { trpcConfig } from 'common';

trpcConfig.set({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    handleLogin: async () => {
        try {
            const response = await chrome.runtime.sendMessage({ type: 'AUTHENTICATE' });
            if (response.message === 'ok') {
                return true;
            }
        } finally {
            return false;
        }
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <PopupApp />
    </React.StrictMode>
);
