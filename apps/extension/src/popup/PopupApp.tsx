import { Button } from 'ui';
import { Text } from 'react-native';

const PopupApp: React.FC = () => {
    const handleLogin = () => {
        chrome.runtime.sendMessage({ type: 'LOGIN' });
    };

    return (
        <div
            style={{ height: 500, width: 300, display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 4 }}
        >
            <Button onPress={handleLogin}>
                <Text>Sign in with Google</Text>
            </Button>
        </div>
    );
};

export default PopupApp;
