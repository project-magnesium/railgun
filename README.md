# Railgun

# Features

-   Yarn Workspaces
-   Devcontainers
-   Typescript
-   TRPC
-   AWS SAM Boilerplate
    -   API Gateway + Lambda + Lambda Authorizer
    -   Cloudfront + S3 + Lambda@Edge to host landing page and web app within a single S3 bucket
    -   Email processor using OpenAI, Google Pub Sub, Eventbridge, SQS, Lambda
-   Web, Mobile & Chrome Extension Boilerplate
-   EAS to create custom Expo builds
-   Shared UI and logic packages
-   CI/CD with Github Actions
    -   Deploy to Staging and Production environments using separate Cloudformation stacks
    -   Build your Chrome extension right from Github Actions. It will updgrade the manifest version automatically
    -   Create EAS Internal and App Store distribution builds for Android/iOS
-   Custom domain names for landing page, web app, and API
-   Google Oauth
-   DynamoDB, Gmail, OpenAI clients

# Installation

## Prerequisites
1. Create Google Oauth apps for the apps you plan on using (i.e. Web, Android, and iOS Oauth apps) [Setting up Google OAuth 2.0](https://support.google.com/cloud/answer/6158849?hl=en)
2. If you plan on creating a mobile app:
    - ensure you have an Expo account and Apple developer license.
    - [Create your first EAS build](https://docs.expo.dev/build/setup/) (Adjust the env in `apps/mobile/eas.json` and `owner, name, slug` fields in `apps/mobile/app.config.js` to suit your needs)
3. If you plan on creating a chrome extension, it may be useful to create a consistent extension ID. This is particularly useful when using any type of authentication since you need a consistent redirect URI for you app. [Setting up consistent extension ID](https://developer.chrome.com/docs/extensions/mv3/manifest/key/)
4. If you plan on using the Gmail parsing feature, ensure you have Google Cloud Pub/Sub setup to send push notifications. Consult [Cloud Pub/Sub Setup](https://developers.google.com/gmail/api/guides/push)

## Installation Instructions

1. Install and configure [Docker](https://www.docker.com/get-started) for your operating system.

2. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in VS Code.

3. Fork the repository.

4. Run `cp -n .devcontainer/devcontainer.env.example .devcontainer/devcontainer.env`. You will need to change the credentials in a later step if you want to setup NoSQL Workbench

5. Replace `reponame` in `packages/api/sam/lambda/aws-toolkit-tsconfig.json` with your repository name.

6. Add appropriate host permissions in `apps/extension/public/manifest.json` to ensure cookie authentication works as expected. e.g. `"host_permissions": ["https://api.<your-domain-name>.com/", "https://api.staging.<your-domain-name>.com/", "http://localhost:3001/"]`

7. Press `Command + Shift + P` and type "Open folder in container" to open the repository in a dev container. The container will take a few minutes to startup.

8. Add any sensitive or missing environment variables to `apps/.env` and `packages/api/env.json` for local development.
    - To generate the `EncryptionKeyParameter` and `EncryptionInitializationVectorParameter`, you can use the following node code:

    ```
    const crypto = require('crypto');
    const EncryptionKeyParameter = crypto.randomBytes(32).toString('base64')
    const EncryptionInitializationVectorParameter = crypto.randomBytes(16).toString('base64')
    ```
    - Helpers to encrypt and decrypt strings exist in `packages/api/utls/crypto.ts`

IMPORTANT NOTE: When developing the React Native app on your own mobile device, you need to replace all `localhost` references in `apps/.env` with your host ip address. e.g. 192.168.X.X

9. Follow these steps if you would like to use NoSQL Workbench to view your local dynamo db tables:

    a. [Download](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.settingup.html) NoSQL Workbench.

    b. Once installed, click on the "Operation builder" tab

    c. Click "Add connection"

    d. Click on the "DynamoDB local" tab

    e. Choose a connection name and click "Connect"

    f. Within the connection, click on the key button to view the credentials NoSQL Workbench assigned this connection

    g. Copy the Access key ID and Secret access key to your `.devcontainer/devcontainer.env` file

    h. Completely delete and restart the container so that the Dynamo DB local container can be restarted with the correct credentials.

# Development

## Running the App

### Entire Stack

`yarn start:web:extension` to run the web app, extension and api in watch mode or `yarn start:web:debug` to run the web app, extension and api in debug mode

or

`yarn start:web` & `yarn start:web:debug` to run the web app and api in watch mode

or

`yarn start:extension` & `yarn start:extension:debug` to run the extension and api in watch mode

_Note: Running the entire stack with mobile is not supported since you need your host machine to run the simulators_

### API Gateway

1. `cd packages/api`
2. Open a new terminal and run `yarn start`. This will build watch your lambda functions and start the SAM local api.

### Frontend

#### Web

1. Open a new terminal and `cd apps/web`
2. `yarn start`

#### Extension

1. Open a new terminal and `cd apps/extension`
2. `yarn start`
3. Upload the generated build folder to [Extensions Manager](chrome://extensions/)
4. You can reload the extension by using this [handy extension](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid)

#### Mobile

1. Open a new terminal outside of the devcontainer and `cd apps/mobile`
2. `yarn start`
3. Open your custom build on a device or simulator. Consult expo documentation for your specific use case if needed.

## Debugging Lambda Functions

1. Run the api using `yarn start:debug`
2. Set breakpoints in the lambda function you want to debug
3. Call the lambda function you want to debug from your app or a tool like postman
4. Go to the Run and Debug panel in VSCode
5. Run the "Attach to SAM CLI" debug configuration
6. Click the play button the first time the debugger pauses as the debugger pauses on entry for an unknown reason. After clicking play the first time, the debugger will pause on the first breakpoint you set

## Adding Dynamo DB Tables

1. In `packages/api/template.yaml`, create a new `AWS::DynamoDB::Table` similar to the existing table resources in the template. Follow the [AWS Documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html) to configure the table
2. When naming the table, ensure the name format follows: TableName${Environment}. Suffixing the table name with the environment name allows for a multi cloud formation stack architecture.
3. Add a new configuration to `packages/api/sam/lambda/localDynamoTables` so that the dev container can start up with the appropriate tables.
4. For the newly created table to propogate locally you can either:

    a. Rebuild the container

    b. Manually run `dynamodb:sync`. This will create new tables added based on new configurations added and leave existing tables untouched.

    c. Manually run `dynamodb:sync:clean`. This will delete all tables and recreate all tables from scratch. This is helpful when trying to update an existing table.

5. To make use of the new table when using the DynamoDB client:

```
import DynamoDBClient from '../utils/dynamoDBClient';

...

# Inside your handler or function
const dynamoDBClient = new DynamoDBClient();
await dynamoDBClient.client.putItem({
    TableName: DynamoDBClient.getTableName('<TABLE_NAME>'),
    Item: {},
});
```

## Adding Functions

1. In `packages/api/template.yaml`, create a new `AWS::Serverless::Function` similar to the existing serverless function resources in the template. Follow the [AWS Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html) to configure the function.
2. Add your handler code to `packages/api/sam/lambda/handler/[name].ts`. Below is a trpc handler template:

```
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { initTRPC } from '@trpc/server';

import DynamoDBClient from '../utils/dynamoDBClient';
import { requestHandler } from '../utils/trpcRequestHandler';

const createContext = ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>) => ({ event });
export const t = initTRPC.context<typeof createContext>().create();
export const appRouter = t.router({
    handlerName: t.procedure.mutation(async (req) => {
        const userID = req.ctx.event.requestContext.authorizer?.userID;

        const dynamoDBClient = new DynamoDBClient();
        await dynamoDBClient.client.putItem({
            TableName: DynamoDBClient.getTableName('<TABLE_NAME>'),
            Item: {},
        });

        // OTHER CODE HERE
    }),
});
export type <LAMBDA_NAME>Router = typeof appRouter;

export const handler = requestHandler({ router: appRouter, createContext });
```

3. Ensure you have `yarn build:watch` running to rebuild as the function changes

4. To use your function within the `common` package, import the Router type, exported from the lambda, into the common object you want to call the function in. Then use `this.trpc.<handler_name>.<query | mutate>()`

## Interacting with the API

The `common` package in `packages/common` is the go to package to make calls to the backend. Create new objects here for your frontend apps to use. With this approach, if the method of getting data from the backend changes for a specific frontend function, you should only need to modify what is in the common package instead of making changes to all frontend apps.

## Clients

Included in this framework are some basic client interfaces for you to work with within the SAM application. Currently supported clients include: DynamoDB, Gmail, and OpenAI. These clients exist within `packages/api/sam/lambda/utils`

# Setting up custom domain names

To connect your custom domain with API Gateway and S3, it may be easier to deploy to Staging and Production manually before using the available Github Actions in case there is any debugging required. The command to deploy is below. Add the appropriate environment variables in the --parameter-overrides option. (You can find all possible environment variables to set in `packages/api/env.json`)

`sam deploy sam deploy --config-env staging --parameter-overrides='EnvironmentParameter=Staging DynamoDBRegionParameter=us-east-1 GoogleOauthClientIDParameter=<YOUR_CLIENT_ID> GoogleOauthClientSecretParameter=<YOUR_CLIENT_SECRET> DomainNameParameter=staging.<YOUR_DOMAIN>.com FullApiDomainNameParameter=https://api.staging.<YOUR_DOMAIN>.com FullDomainNameParameter=https://www.staging.<YOUR_DOMAIN>.com OpenAISecretKeyParameter=<YOUR_SECRET>'`

When deploying the SAM app to Staging or Production, you will need to validate the certificate AWS creates by adding the appropriate CNAME's to your DNS provider.

1. Go to AWS Certificate Manager and click on the certificate created by the deployment
2. Add the CNAME within the certificate to your DNS to verify. Once set wait for verification to complete
3. Add a CNAME to direct `https://api.staging.<YOUR_DOMAIN>.com` to API Gateway.
4. Add a permanent redirect to cloudfront. Forward `<YOUR_DOMAIN>.com` to `https://www.<YOUR_DOMAIN>.com`

# Deployment

1. Add appropriate Github secrets for use in Github Workflows (`.github/workflows/`). You can add the secrets in the repository settings under "Secrets and variables".
2. Manually run workflows to deploy or build your apps

# Other
## Notes on Styling
This framework assumes that you may need a Chrome Extension with UI injected into web pages. The UI package, included in Railgun, uses a library called `react-native-media-query` to help with responsiveness cross platform as well as translate styling to inline styles on web for better css specificity. Inline styles come with a performance hit as apps scale. If you don't need an injected content script, you can opt out of the styling strategy chosen for your own and potentially use a component library like [Tamagui](https://tamagui.dev/).