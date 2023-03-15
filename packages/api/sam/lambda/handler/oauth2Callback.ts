import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OAuth2Client } from 'google-auth-library';
import RequestHandler from '../utils/requestHandler';
import DynamoDBClient from '../utils/dynamoDBClient';

const {
    FullDomainNameParameter,
    GoogleOauthClientIDParameter,
    GoogleOauthClientSecretParameter,
    FullApiDomainNameParameter,
} = process.env;

const getHandler = async (event: APIGatewayProxyEvent) => {
    const userID = event.requestContext.authorizer?.userID;

    const oauth2Client = new OAuth2Client(
        GoogleOauthClientIDParameter,
        GoogleOauthClientSecretParameter,
        `${FullApiDomainNameParameter}/oauth2Callback`,
    );

    const q = {
        error: event.queryStringParameters?.error,
        code: event.queryStringParameters?.code,
    };

    if (q.error) {
        console.log('Error:' + q.error);
    } else if (q.code) {
        const { tokens } = await oauth2Client.getToken(q.code);
        oauth2Client.setCredentials(tokens);

        const dynamoDBClient = new DynamoDBClient();

        if (!tokens.access_token || !tokens.refresh_token) {
            throw Error('Missing access token or refresh token');
        }

        await dynamoDBClient.client.putItem({
            TableName: DynamoDBClient.getTableName('GoogleUserTokens'),
            Item: {
                userID: { S: userID },
                accessToken: { S: tokens.access_token },
                refreshToken: { S: tokens.refresh_token },
            },
        });
    } else {
        throw Error('No code retrieved from Google Oauth server');
    }

    return {
        statusCode: 303,
        headers: {
            Location: `${FullDomainNameParameter as string}/app`,
        },
    };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestHandler = new RequestHandler({ event, getHandler });
    return await requestHandler.handleRequest();
};
