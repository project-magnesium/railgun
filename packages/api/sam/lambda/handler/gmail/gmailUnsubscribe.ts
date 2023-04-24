import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { initTRPC, TRPCError } from '@trpc/server';

import DynamoDBClient from '../../utils/dynamoDBClient';
import { requestHandler } from '../../utils/trpcRequestHandler';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import GmailClient from '../../utils/gmailClient';
import { decrypt } from '../../utils/crypto';

const createContext = ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => ({ event });
export const t = initTRPC.context<typeof createContext>().create();
export const appRouter = t.router({
    gmailUnsubscribe: t.procedure.mutation(async (req) => {
        try {
            const userID = req.ctx.event.requestContext.authorizer?.userID;

            const dynamoDBClient = new DynamoDBClient();
            const profileResponse = await dynamoDBClient.client.getItem({
                TableName: DynamoDBClient.getTableName('Profile'),
                Key: {
                    userId: { S: userID },
                },
            });
            const profileItem = profileResponse.Item ?? {};
            const profile = unmarshall(profileItem);

            const response = await dynamoDBClient.client.getItem({
                TableName: DynamoDBClient.getTableName('GoogleUserTokens'),
                Key: {
                    email: { S: profile.email },
                },
            });

            const item = response.Item ?? {};

            const tokens = unmarshall(item);

            const gmailClient = new GmailClient(decrypt(tokens.refreshToken));
            await gmailClient.client.users.stop({
                userId: 'me',
            });
        } catch (e) {
            console.error(e);
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }
    }),
});
export type GmailUnsubscribeRouter = typeof appRouter;

export const handler = requestHandler({ router: appRouter, createContext });
