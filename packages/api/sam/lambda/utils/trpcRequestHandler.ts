import { Context, APIGatewayEvent } from 'aws-lambda';
import type { AnyRouter } from '@trpc/server';
import { awsLambdaRequestHandler, AWSLambdaOptions } from '@trpc/server/adapters/aws-lambda';
const { FullDomainNameParameter } = process.env;

export const requestHandler =
    <TRouter extends AnyRouter, TEvent extends APIGatewayEvent>(opts: AWSLambdaOptions<TRouter, TEvent>) =>
    async (event: TEvent, context: Context) => {
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': FullDomainNameParameter as string,
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                    'Referrer-Policy': 'no-referrer',
                    'Access-Control-Allow-Credentials': 'true',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST',
                },
                body: JSON.stringify({ message: 'ok' }),
            };
        }

        return await awsLambdaRequestHandler({
            router: opts.router,
            createContext: opts.createContext,
            responseMeta() {
                return {
                    headers: {
                        'Access-Control-Allow-Origin': FullDomainNameParameter as string,
                        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                        'Referrer-Policy': 'no-referrer',
                        'Access-Control-Allow-Credentials': 'true',
                    },
                };
            },
        })(event, context);
    };
