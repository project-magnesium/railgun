import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
const { FullDomainNameParameter } = process.env;

interface RequestHandlerOptions {
    event: APIGatewayProxyEvent;
    includeOptionsHandler?: boolean;
    getHandler?: Handler;
    postHandler?: Handler;
}

type Handler = (
    event: APIGatewayProxyEvent,
) => Promise<(Partial<Omit<APIGatewayProxyResult, 'body'>> & { data?: object }) | void>;

export default class RequestHandler {
    _event: APIGatewayProxyEvent;
    _includeOptionsHandler: boolean;
    _getHandler?: Handler;
    _postHandler?: Handler;

    constructor({ event, getHandler, postHandler, includeOptionsHandler = true }: RequestHandlerOptions) {
        this._event = event;
        this._includeOptionsHandler = includeOptionsHandler;
        this._getHandler = getHandler;
        this._postHandler = postHandler;
    }

    async handleRequest(): Promise<APIGatewayProxyResult> {
        try {
            switch (this._event.httpMethod) {
                case 'GET':
                    if (this._getHandler) {
                        return await this._runHandler(this._getHandler);
                    } else {
                        throw Error('Not supported');
                    }
                case 'POST':
                    if (this._postHandler) {
                        return await this._runHandler(this._postHandler);
                    } else {
                        throw Error('Not supported');
                    }
                default:
                    if (this._includeOptionsHandler) {
                        return this._runOptionsHandler();
                    } else {
                        throw Error('Not supported');
                    }
            }
        } catch (e) {
            console.log(e);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': FullDomainNameParameter as string,
                },
                body: JSON.stringify({
                    message: 'some error happened',
                }),
            };
        }
    }

    async _runHandler(handler: Handler): Promise<APIGatewayProxyResult> {
        let result = await handler(this._event);
        if (!result) result = {};

        return {
            statusCode: result.statusCode ?? 200,
            headers: {
                'Access-Control-Allow-Origin': FullDomainNameParameter as string,
                'Access-Control-Allow-Credentials': 'true',
                ...result.headers,
            },
            body: result.data
                ? JSON.stringify({ message: 'ok', data: result.data })
                : JSON.stringify({ message: 'ok' }),
        };
    }

    _runOptionsHandler() {
        let allowMethods = 'OPTIONS';
        if (this._getHandler) allowMethods += ',GET';
        if (this._postHandler) allowMethods += ',POST';

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': FullDomainNameParameter as string,
                'Access-Control-Allow-Methods': allowMethods,
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Credentials': 'true',
            },
            body: JSON.stringify({ message: 'ok' }),
        };
    }
}
