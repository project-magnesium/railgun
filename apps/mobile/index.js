import { registerRootComponent } from 'expo';
import { trpcConfig } from 'common';
import App from './App';
import { VITE_API_BASE_URL } from '@env';

trpcConfig.set({
    baseURL: VITE_API_BASE_URL,
    handleLogin: () => {
        // TODO: Implement how you want to handle mobile re authentication flow

        return Promise.resolve(false);
    },
});

registerRootComponent(App);
