import { APIGatewayProxyEvent } from 'aws-lambda';
import DynamoDBClient from '../utils/dynamoDBClient';
import GmailClient from '../utils/gmailClient';
import OpenAIClient from '../utils/openAIClient';

export const handler = async (event: APIGatewayProxyEvent) => {
    const userID = '1234';

    const dynamoDBClient = new DynamoDBClient();
    const item = await dynamoDBClient.client.getItem({
        TableName: DynamoDBClient.getTableName('GoogleUserTokens'),
        Key: { userID: { S: userID } },
    });

    const refreshToken = item.Item?.refreshToken?.S;

    const gmailClient = new GmailClient(refreshToken);
    const messageResponse = await gmailClient.client.users.messages.list({
        userId: 'me',
        q: 'after:2023/03/02 before:2023/03/04',
    });
    console.log(JSON.stringify(messageResponse.data.messages));

    const openAIClient = new OpenAIClient();
    const completion = await openAIClient.client.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Who was the first president?' }],
    });
};
