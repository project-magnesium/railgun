import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    base: mode === 'dev' ? '/' : '/app/',
    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
    },
    build: {
        minify: mode === 'production',
    },
    envDir: '../',
}));
