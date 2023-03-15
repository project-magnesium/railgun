import { DynamoDBClientConfig, DynamoDB } from '@aws-sdk/client-dynamodb';
const {
    EnvironmentParameter,
    DynamoDBRegionParameter,
    DynamoDBEndpointParameter,
    AWSAccessKeyIDParameter,
    AWSSecretKeyIDParameter,
} = process.env;

export default class DynamoDBClient {
    client: DynamoDB;

    constructor() {
        const dynamoDBClientConfig = this.getDynamoDBClientConfig();
        this.client = new DynamoDB(dynamoDBClientConfig);
        return;
    }

    getDynamoDBClientConfig(): DynamoDBClientConfig {
        const dynamoDBClientConfig: DynamoDBClientConfig = {
            region: DynamoDBRegionParameter,
        };
        if (DynamoDBEndpointParameter !== 'undefined') {
            dynamoDBClientConfig.endpoint = DynamoDBEndpointParameter;
        }

        if (AWSAccessKeyIDParameter !== 'undefined' && AWSSecretKeyIDParameter !== 'undefined') {
            dynamoDBClientConfig.credentials = {
                accessKeyId: AWSAccessKeyIDParameter as string,
                secretAccessKey: AWSSecretKeyIDParameter as string,
            };
        }

        return dynamoDBClientConfig;
    }

    static getTableName(tableName: string): string {
        return `${tableName}${EnvironmentParameter}`;
    }
}
