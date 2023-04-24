import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import RequestHandler from '../../utils/requestHandler';
import DynamoDBClient from '../../utils/dynamoDBClient';
import GmailClient from '../../utils/gmailClient';
import OpenAIClient from '../../utils/openAIClient';
import { decrypt } from '../../utils/crypto';

const postHandler = async (event: APIGatewayProxyEvent) => {
    try {
        if (!event.body) throw Error('No body in event');
        const body = JSON.parse(event.body);
        const pubSubData = Buffer.from(body.message.data, 'base64').toString('utf-8');
        const parsedPubSubData = JSON.parse(pubSubData);

        // Get refresh token
        const dynamoDBClient = new DynamoDBClient();
        const googleUserTokenItem = await dynamoDBClient.client.getItem({
            TableName: DynamoDBClient.getTableName('GoogleUserTokens'),
            Key: { email: { S: parsedPubSubData.emailAddress } },
        });

        const { userId, refreshToken } = unmarshall(googleUserTokenItem.Item ?? {});

        // Get the previous history id
        const gmailHistoryIdItem = await dynamoDBClient.client.getItem({
            TableName: DynamoDBClient.getTableName('GmailHistoryId'),
            Key: { userId: { S: userId } },
        });
        const gmailHistoryId = unmarshall(gmailHistoryIdItem.Item ?? {});

        // IF there is no history id currently stored, return success since there will be no messages to read
        if (!gmailHistoryId.historyId) {
            return { statusCode: 200 };
        }

        const gmailClient = new GmailClient(decrypt(refreshToken));
        const { data } = await gmailClient.client.users.history.list({
            userId: 'me',
            startHistoryId: gmailHistoryId.historyId,
            historyTypes: ['messageAdded'],
            labelId: 'INBOX',
        });

        // no messages to read
        if (!data.history || data.history.length === 0) return { statusCode: 200 };

        for (const history of data.history) {
            if (history.messagesAdded) {
                for (const messageAdded of history.messagesAdded) {
                    if (!messageAdded.message || !messageAdded.message.id) continue;

                    // get and parse the email body
                    const { data } = await gmailClient.client.users.messages.get({
                        userId: 'me',
                        id: messageAdded.message.id,
                        format: 'full',
                    });

                    let body;
                    if (data.payload?.parts && data.payload.parts.length > 0) {
                        body = data.payload.parts[0].body?.data;
                    } else {
                        body = data.payload?.body?.data;
                    }

                    if (!body) continue;

                    const parsedBody = Buffer.from(body, 'base64').toString();

                    // Call open ai to parse the email body
                    const openAIClient = new OpenAIClient();
                    const completion = await openAIClient.client.createChatCompletion({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'user',
                                content: `Is this a product email? Give me a yes or no answer: "${parsedBody}"`,
                            },
                        ],
                    });

                    // Save the email body and the open ai response to the database
                    await dynamoDBClient.client.putItem({
                        TableName: DynamoDBClient.getTableName('Email'),
                        Item: {
                            userId: { S: userId },
                            data: { S: parsedBody },
                            openAIResponse: { S: completion.data.choices[0].message?.content ?? '' },
                            createdDate: { S: new Date().toISOString() },
                            modifiedDate: { S: new Date().toISOString() },
                        },
                    });
                }
            }
        }

        // Store the new history id
        await dynamoDBClient.client.updateItem({
            TableName: DynamoDBClient.getTableName('GmailHistoryId'),
            Key: { userId: { S: userId } },
            UpdateExpression: 'SET historyId = :historyId, modifiedDate = :modifiedDate',
            ExpressionAttributeValues: {
                ':historyId': { S: parsedPubSubData.historyId.toString() },
                ':modifiedDate': { S: new Date().toISOString() },
            },
        });
    } catch (error) {
        console.error(error);
    }

    return { statusCode: 200 };
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const requestHandler = new RequestHandler({ event, postHandler });
    return await requestHandler.handleRequest();
};
