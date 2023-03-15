module.exports = {
    owner: 'exponame',
    name: 'exponame',
    slug: 'exponame',
    scheme: process.env.SCHEME,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        bundleIdentifier: process.env.IDENTIFIER,
        supportsTablet: true,
    },
    android: {
        package: process.env.IDENTIFIER,
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF',
        },
    },
    web: {
        favicon: './assets/favicon.png',
    },
};
