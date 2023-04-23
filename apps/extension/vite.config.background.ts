import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    build: {
        minify: mode !== 'dev',
        sourcemap: mode === 'dev',
        emptyOutDir: false,
        rollupOptions: {
            input: {
                background: 'src/background/background.ts',
            },
            output: {
                inlineDynamicImports: true,
                entryFileNames: '[name].js',
                dir: 'public/build',
            },
        },
    },
    envDir: '../',
}));
