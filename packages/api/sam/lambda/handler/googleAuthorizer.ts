import { OAuth2Client } from 'google-auth-library';
import { initTRPC } from '@trpc/server';

import { requestHandler } from '../utils/trpcRequestHandler';
const { FullApiDomainNameParameter, GoogleOauthClientIDParameter, GoogleOauthClientSecretParameter } = process.env;

export const t = initTRPC.create();
export const appRouter = t.router({
    googleAuthorizer: t.procedure.query(async () => {
        const oauth2Client = new OAuth2Client(
            GoogleOauthClientIDParameter,
            GoogleOauthClientSecretParameter,
            `${FullApiDomainNameParameter}/oauth2Callback`,
        );

        const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
        });

        return { data: { authorizationUrl } };
    }),
});
export type GoogleAuthorizerRouter = typeof appRouter;

export const handler = requestHandler({ router: appRouter });
