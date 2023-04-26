import { useEffect, useState } from 'react';
import { Provider } from 'ui';
import Login from './Login';

const SCREENS = {
    LOGIN: 'LOGIN',
    HOME: 'HOME'
};

const Content: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<string>(SCREENS.LOGIN);

    const handleMessage = (
        message: any,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
    ) => {
        let replyMessage = 'ok';
        let replyData: any = {};

        if (message.type === 'CONTENT_NAVIGATE_TO_LOGIN') {
            setCurrentScreen(SCREENS.LOGIN);
        }

        sendResponse({ message: replyMessage, data: replyData });
    };

    useEffect(() => {
        chrome.runtime.onMessage.addListener(handleMessage);

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    const handleLogin = () => {
        setCurrentScreen(SCREENS.HOME);
    }

    return (
        <div style={{ position: 'absolute', top: 0 }}>
            <Provider>
                {currentScreen === SCREENS.LOGIN && <Login onLogin={handleLogin} />}
                {currentScreen === SCREENS.HOME && <div>Home</div>>}
            </Provider>
        </div>
    );
};

export default Content;
