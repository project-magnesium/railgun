import React from 'react';
import ReactDOM from 'react-dom/client';
import ContentApp from './ContentApp';
import './content.css';

const rootElement = document.createElement('div');
rootElement.id = 'railgun-app-root';
rootElement.setAttribute('class', 'railgun-app-root');

document.body.appendChild(rootElement);

ReactDOM.createRoot(document.getElementById('railgun-app-root') as HTMLElement).render(<ContentApp />);
