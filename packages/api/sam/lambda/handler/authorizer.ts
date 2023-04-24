import { APIGatewayRequestAuthorizerEvent, Context, Callback } from 'aws-lambda';
import { OAuth2Client } from 'google-auth-library';
import { getCookie } from '../utils/cookie';
import generatePolicy from '../utils/generatePolicy';

export const handler = async (event: APIGatewayRequestAuthorizerEvent, context: Context, callback: Callback) => {
    const { GoogleOauthClientIDParameter, GoogleOauthIOSClientIDParameter, GoogleOauthAndroidClientIDParameter } =
        process.env;

    try {
        if (!event.headers?.cookie) throw new Error('No cookie found in request headers');
        if (!GoogleOauthClientIDParameter || !GoogleOauthIOSClientIDParameter || !GoogleOauthAndroidClientIDParameter)
            throw new Error('Production parameters are not set');

        const token = getCookie(event.headers.cookie, 'cred');

        if (!token) throw new Error('No token found in cookie');

        const client = new OAuth2Client(GoogleOauthClientIDParameter);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: [
                GoogleOauthClientIDParameter,
                GoogleOauthIOSClientIDParameter,
                GoogleOauthAndroidClientIDParameter,
            ],
        });
        const payload = ticket.getPayload();
        const userID = payload?.sub;

        callback(null, generatePolicy('user', 'Allow', event.methodArn, { userID: userID as string }));
    } catch (e) {
        console.error(e);
        callback('Unauthorized');
    }
};
