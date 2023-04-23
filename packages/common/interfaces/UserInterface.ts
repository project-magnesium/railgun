import BaseInterface from './BaseInterface';
import type { GoogleAuthorizerRouter } from 'lambda/handler/googleAuthorizer';
import type { GmailUnsubscribeRouter } from 'lambda/handler/gmailUnsubscribe';

export class UserInterface extends BaseInterface<
    GoogleAuthorizerRouter & GmailUnsubscribeRouter
> {
    async authorizeGmail() {
        return await this.trpc.googleAuthorizer.query();
    }

    async gmailUnsubscribe() {
        return await this.trpc.gmailUnsubscribe.mutate();
    }
}
