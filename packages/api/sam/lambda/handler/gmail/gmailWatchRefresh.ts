import { APIGatewayProxyEvent } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import DynamoDBClient from '../../utils/dynamoDBClient';
import GmailClient from '../../utils/gmailClient';
import { decrypt } from '../../utils/crypto';

const { GmailPubSubTopicParameter } = process.env;

const refreshWatch = async (refreshToken: string) => {
    const gmailClient = new GmailClient(refreshToken);
    await gmailClient.client.users.watch({
        userId: 'me',
        requestBody: {
            topicName: GmailPubSubTopicParameter,
            labelIds: ['INBOX'],
        },
    });
};

/**
 * This function runs daily. It's purpose is to refresh the watch on all users' Gmail accounts. This is necessary because the watch expires after 7 days.
 * Google recommends refreshing the watch every day.
 */
export const handler = async (event: APIGatewayProxyEvent) => {
    const dynamoDBClient = new DynamoDBClient();
    const googleUserTokens = await dynamoDBClient.client.scan({
        TableName: DynamoDBClient.getTableName('GoogleUserTokens'),
    });

    const items = googleUserTokens.Items ?? [];
    for (const item of items) {
        const tokens = unmarshall(item);
        await refreshWatch(decrypt(tokens.refreshToken));
    }
};
