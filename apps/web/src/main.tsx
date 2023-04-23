import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login';
import { Provider } from 'ui';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { trpcConfig } from 'common';

trpcConfig.set({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    handleLogin: () => {
        window.location.href = '/app/';

        return Promise.resolve(false);
    },
});

const LoginRedirect = () => {
    const handleRedirect = async () => {
        // Add any additional logic here
        window.location.href = '/app/home';
    };

    useEffect(() => {
        handleRedirect();
    }, []);

    return <div>Redirecting...</div>;
};

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <Login />,
        },
        {
            path: '/loginredirect',
            element: <LoginRedirect />,
        },
        {
            path: '/home',
            element: <Home />,
        },
    ],
    { basename: '/app' }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <Provider>
        <RouterProvider router={router} />
    </Provider>
);
