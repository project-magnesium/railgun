import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OAuth2Client } from 'google-auth-library';
import RequestHandler from '../utils/requestHandler';

const { DomainNameParameter, FullDomainNameParameter, GoogleOauthClientIDParameter } = process.env;

const postHandler = async (event: APIGatewayProxyEvent) => {
    const token = event.body.split('&')[0].split('=')[1];
    const client = new OAuth2Client(GoogleOauthClientIDParameter);
    await client.verifyIdToken({
        idToken: token,
        audience: GoogleOauthClientIDParameter,
    });

    return {
        statusCode: 303,
        headers: {
            'Set-Cookie': `cred=${token}; Domain=${DomainNameParameter}; Secure; HttpOnly`,
            Location: `${FullDomainNameParameter as string}/app`,
        },
    };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestHandler = new RequestHandler({ event, postHandler });
    return await requestHandler.handleRequest();
};
