import {
    PolicyDocument,
    AuthResponse,
    Statement,
    APIGatewayRequestAuthorizerEvent,
    Context,
    Callback,
} from 'aws-lambda';
import { OAuth2Client } from 'google-auth-library';

export const handler = async (event: APIGatewayRequestAuthorizerEvent, context: Context, callback: Callback) => {
    const { GoogleOauthClientIDParameter, GoogleOauthIOSClientIDParameter, GoogleOauthAndroidClientIDParameter } =
        process.env;

    try {
        const token = getCookie(event.headers.cookie, 'cred');

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

        callback(null, generatePolicy('user', 'Allow', event.methodArn, userID as string));
    } catch (e) {
        console.error(e);
        callback('Error: Invalid token');
    }
};

const escape = (name: string) => {
    return name.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
};

const getCookie = (cookie: string, name: string) => {
    const match = cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));
    return match ? match[1] : null;
};

// Help function to generate an IAM policy
const generatePolicy = (principalId: string, effect: string, resource: string, userID: string) => {
    if (!effect || !resource) return;

    const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: [],
    };

    const statementOne: Statement = {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
    };
    policyDocument.Statement[0] = statementOne;

    const authResponse: AuthResponse = {
        principalId,
        policyDocument,
        context: { userID },
    };
    return authResponse;
};
