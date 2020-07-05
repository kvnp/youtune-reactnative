const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackEnv = process.env.NODE_ENV || 'development';

module.exports = {
    mode: webpackEnv,

    entry: {
        app: path.join(__dirname, './index.web.js'),
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
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
                include: path.resolve(__dirname, "node_modules/react-native-vector-icons"),
                use: {
                    loader: "file-loader",
                }
            },
        ]
    },    

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './index.html'),
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    
    resolve: {
        extensions: [
            '.web.jsx',
            '.web.js',
            '.jsx',
            '.js',
        ],
        alias: {
            'react-native$': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient'
        }
    },
};