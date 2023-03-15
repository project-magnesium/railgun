import { Configuration, OpenAIApi } from 'openai';

const { OpenAISecretKeyParameter } = process.env;

export default class OpenAIClient {
    client: OpenAIApi;

    constructor() {
        const configuration = new Configuration({
            apiKey: OpenAISecretKeyParameter,
        });
        this.client = new OpenAIApi(configuration);
    }
}
