const REDIRECT_URL = chrome.identity.getRedirectURL();
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = ['openid', 'email', 'profile'];
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=id_token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;

const extractIdToken = (redirectUri: string) => {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1) return null;
    let params = new URLSearchParams(m[1].split('#')[0]);
    return params.get('id_token');
};

const validate = async (redirectURL: string | undefined) => {
    if (!redirectURL) return;

    const idToken = extractIdToken(redirectURL);
    if (!idToken) {
        throw 'Authorization failure';
    }

    await chrome.cookies.set({
        httpOnly: true,
        domain: `.${import.meta.env.VITE_DOMAIN_NAME}`,
        secure: true,
        name: 'cred',
        value: idToken,
        url: import.meta.env.VITE_API_BASE_URL,
    });
};

const authorize = (interactive: boolean = true) => {
    return chrome.identity.launchWebAuthFlow({
        interactive,
        url: AUTH_URL,
    });
};

const getAccessToken = async (interactive: boolean = true) => {
    return authorize(interactive).then(validate);
};

const handleMessage = async (message: any, sender: chrome.runtime.MessageSender, reply: (response?: any) => void) => {
    let replyMessage = 'ok';
    let replyData: any = {};
    try {
        const type = message.type;

        if (type === 'AUTHENTICATE') {
            await getAccessToken(false);
        }
        if (type === 'LOGIN') {
            await getAccessToken();
        }
    } catch (e: any) {
        console.log(e);
        replyMessage = e.message;
    }
    reply({ message: replyMessage, data: replyData });
};

chrome.runtime.onMessage.addListener((message, sender, reply) => {
    handleMessage(message, sender, reply);

    return true;
});

export default {};
