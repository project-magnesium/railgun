import React from 'react';
import ReactDOM from 'react-dom/client';
import ContentApp from './ContentApp';

const rootElement = document.createElement('div');
rootElement.id = 'app-root';

rootElement.setAttribute(
    'style',
    'position: fixed; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; z-index: 2147483640'
);

document.body.appendChild(rootElement);

ReactDOM.createRoot(document.getElementById('app-root') as HTMLElement).render(
    <React.StrictMode>
        <ContentApp />
    </React.StrictMode>
);
