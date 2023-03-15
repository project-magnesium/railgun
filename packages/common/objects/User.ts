import BaseObject from './BaseObject';
import type { TestRouter } from 'lambda/handler/test';
import type { GoogleAuthorizerRouter } from 'lambda/handler/googleAuthorizer';

export default class User extends BaseObject<TestRouter & GoogleAuthorizerRouter> {
    async test() {
        return await this.trpc.test.query();
    }

    async authorizeGmail() {
        return await this.trpc.googleAuthorizer.query();
    }
}
