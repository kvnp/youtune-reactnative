const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackEnv = process.env.NODE_ENV || 'development';

module.exports = (defaults) => ({
    ...defaults,

    entry: {
        app: './index.web.js',
        /*index: [
            //'react-native-webpack/clients/polyfills.js',
            './index.web.js',
        ]*/
    },

    output: {
        path: __dirname + '/dist',
        filename: 'app-[hash].bundle.js',
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.(ts|tsx|jsx|js|mjs)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: [
                            'module:metro-react-native-babel-preset'
                        ],
                        plugins: [
                            ["react-native-web", { commonjs: true }]
                        ],
                    },
                }
            },

            {
                test: /\.css$/,
                use: {
                    loader: 'style-loader!css-loader'
                }
            },

            {
                test: /\.(png|jpe?g|gif)$/i,
                use: {
                    loader: 'file-loader',
                }
            },

            {
                test: /\.ttf$/,
                loader: "file-loader"
            },
        ]
    },    

    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient'
        },

        extensions: [
            '.web.jsx',
            '.web.js',
            '.jsx',
            '.js',
            '.json'
        ],
    },
});