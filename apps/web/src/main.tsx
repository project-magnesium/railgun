import React, { useEffect, CSSProperties } from 'react';
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

interface HomePageProps {
}

const Home: React.FC<HomePageProps> = ({ }) => {
  const styles = {
    container: {
      background: 'radial-gradient(circle at top left, #dadada 0%, #ffffff00 100%)', // Background radial gradient
      width: '100%',
      height: '100%',
      display: 'flex',
      border: '1px solid black',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif', // Font family
    },
    title: {
      fontSize: '48pt',
      color: '#333333',
      textShadow: '2px 2px 2px rgba(0, 0, 0, 0.2)', // Drop shadow for the title
    },
    text: {
      fontSize: '16pt',
      color: '#333333',
      marginBottom: '10px',
    },
    code: {
      fontSize: '14pt',
      color: '#333333',
      backgroundColor: '#ffffff',
      padding: '5px',
      borderRadius: '4px',
    },
  };

  return (
    <div style={styles.container as CSSProperties}>
      <h1 style={styles.title}>Welcome to Railgun</h1>
      <p style={styles.text}>Your development environment is running.</p>
      <p style={styles.text}>
        To get started with your new Railgun app, modify the following React component:
      </p>
      <code style={styles.code}>apps/web/src/main.tsx</code>
      <p style={styles.text}>Happy hacking!</p>
    </div>
  );
};

// const Home = () => {
//     return <div>Railgun Framework - Edit /apps/web/src/main.tsx</div>;
// };

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
