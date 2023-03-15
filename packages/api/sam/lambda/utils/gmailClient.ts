import { OAuth2Client } from 'google-auth-library';
import { gmail, gmail_v1 } from '@googleapis/gmail';

const { GoogleOauthClientIDParameter, GoogleOauthClientSecretParameter } = process.env;

export default class GmailClient {
    client: gmail_v1.Gmail;

    constructor(refreshToken: string) {
        const oauth2Client = new OAuth2Client(GoogleOauthClientIDParameter, GoogleOauthClientSecretParameter);
        oauth2Client.setCredentials({
            refresh_token: refreshToken,
        });
        this.client = gmail({ version: 'v1', auth: oauth2Client });
    }
}
