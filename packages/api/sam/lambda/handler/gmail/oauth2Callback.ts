import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { OAuth2Client } from 'google-auth-library';
import RequestHandler from '../../utils/requestHandler';
import DynamoDBClient from '../../utils/dynamoDBClient';
import GmailClient from '../../utils/gmailClient';
import { encrypt } from '../../utils/crypto';

const {
    FullDomainNameParameter,
    GoogleOauthClientIDParameter,
    GoogleOauthClientSecretParameter,
    FullApiDomainNameParameter,
    GmailPubSubTopicParameter,
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
        if (!tokens.access_token || !tokens.refresh_token) {
            throw Error('Missing access token or refresh token');
        }
        oauth2Client.setCredentials(tokens);

        const { email } = await oauth2Client.getTokenInfo(tokens.access_token);

        if (!email) throw Error('No email retrieved from Google Oauth server');

        const dynamoDBClient = new DynamoDBClient();

        await dynamoDBClient.client.putItem({
            TableName: DynamoDBClient.getTableName('GoogleUserTokens'),
            Item: {
                email: { S: email },
                userId: { S: userID },
                accessToken: { S: encrypt(tokens.access_token) },
                refreshToken: { S: encrypt(tokens.refresh_token) },
            },
        });

        const gmailClient = new GmailClient(tokens.refresh_token);
        const { data: watchData } = await gmailClient.client.users.watch({
            userId: 'me',
            requestBody: {
                topicName: GmailPubSubTopicParameter,
                labelIds: ['INBOX'],
            },
        });

        await dynamoDBClient.client.putItem({
            TableName: DynamoDBClient.getTableName('GmailHistoryId'),
            Item: {
                userId: { S: userID },
                historyId: { S: watchData.historyId ?? '' },
                createdDate: { S: new Date().toISOString() },
                modifiedDate: { S: new Date().toISOString() },
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
