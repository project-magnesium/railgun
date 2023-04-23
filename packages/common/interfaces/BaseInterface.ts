import { trpcConfig } from '../TRPCConfig';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server/dist/core/router';

export default class BaseInterface<TRouter extends AnyRouter> {
    trpc;

    constructor() {
        const { baseURL, handleLogin } = trpcConfig.get();
        this.trpc = createTRPCProxyClient<TRouter>({
            links: [
                httpBatchLink({
                    url: baseURL,
                    fetch: async (url, options) => {
                        const request = () => {
                            return fetch(url, {
                                ...options,
                                credentials: 'include',
                            });
                        };

                        const response = await request();
                        if (response.status === 401) {
                            const loggedIn = await handleLogin();
                            if (loggedIn) {
                                return await request();
                            }
                        }

                        return response;
                    },
                }),
            ],
            transformer: null as any,
        });
    }
}
