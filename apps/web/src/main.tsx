import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { trpcConfig } from 'common';

trpcConfig.set({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    handleLogin: () => {
        window.location.href = '/login';

        return Promise.resolve(false);
    },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
