import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';

import { requestHandler } from '../utils/trpcRequestHandler';
import DynamoDBClient from '../utils/dynamoDBClient';

const createContext = ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => ({ event });
export const t = initTRPC.context<typeof createContext>().create();
export const appRouter = t.router({
    test: t.procedure.query(async (req) => {
        const userID = req.ctx.event.requestContext.authorizer?.userID;

        const dynamoDBClient = new DynamoDBClient();

        await dynamoDBClient.client.putItem({
            TableName: DynamoDBClient.getTableName('DynamoDBTable'),
            Item: { id: { S: userID }, date: { S: Date.now().toString() } },
        });
    }),
});
export type TestRouter = typeof appRouter;

export const handler = requestHandler({ router: appRouter, createContext });
