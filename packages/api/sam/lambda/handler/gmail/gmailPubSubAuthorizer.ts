import { APIGatewayRequestAuthorizerEvent, Context, Callback } from 'aws-lambda';
import { OAuth2Client } from 'google-auth-library';

import generatePolicy from '../../utils/generatePolicy';

/**
 * This is the authorizer for the Gmail PubSub service. No one should be able to call this endpoint unless it is the pub sub push service
 */
export const handler = async (event: APIGatewayRequestAuthorizerEvent, context: Context, callback: Callback) => {
    const { GoogleOauthClientIDParameter, GmailPubSubEmailParameter } = process.env;

    try {
        if (!event.headers?.Authorization) throw new Error('No authorization header');

        const bearer = event.headers.Authorization;
        const match = bearer.match(/Bearer (.*)/);
        if (!match) throw Error('No Bearer token');
        const token = match[1];

        const client = new OAuth2Client(GoogleOauthClientIDParameter);
        const ticket = await client.verifyIdToken({ idToken: token });

        const claim = ticket.getPayload();

        if (!claim || !claim.email_verified || claim.email !== GmailPubSubEmailParameter)
            throw Error('Incorrect claim');

        callback(null, generatePolicy('user', 'Allow', event.methodArn));
    } catch (e) {
        console.error(e);
        callback('Unauthorized');
    }
};
