//webpack.config.js
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

const config = {
    mode: 'development',
    devtool: false,
    entry: glob.sync('./handler/**.ts').reduce(function (obj, el) {
        obj[path.parse(el).name] = el;
        return obj;
    }, {}),
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            fallbackModuleFilenameTemplate: '[absolute-resource-path]',
            moduleFilenameTemplate: '[absolute-resource-path]',
        }),
        // Ignoring a "Critical dependency: the request of a dependency is an expression" warning coming from aws-crt
        new webpack.ContextReplacementPlugin(/\/aws-crt\//, (data) => {
            delete data.dependencies[0].critical;
            return data;
        }),
    ],
    target: 'node',
    externals: ['aws-sdk'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
        ],
    },
};

const localConfig = Object.assign({}, config, {
    output: {
        path: path.resolve(__dirname, './built'),
        filename: '[name]/[name].js',
        libraryTarget: 'commonjs',
    },
});

const productionConfig = Object.assign({}, config, {
    output: {
        path: path.resolve(__dirname, './built'),
        filename: '[name].js',
        libraryTarget: 'commonjs',
    },
});

module.exports = [localConfig, productionConfig];
