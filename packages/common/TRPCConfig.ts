interface TRPCConfigType {
    baseURL: string;
    handleLogin: () => Promise<boolean>;
}

class TRPCConfig {
    _config: TRPCConfigType;

    constructor() {
        this._config = {
            baseURL: '',
            handleLogin: () => Promise.resolve(false),
        };
    }

    get(): TRPCConfigType {
        return this._config;
    }

    set(config: TRPCConfigType) {
        this._config = { ...this._config, ...config };
    }
}

export const trpcConfig = new TRPCConfig();
