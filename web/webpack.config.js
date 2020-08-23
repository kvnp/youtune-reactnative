const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (defaults) => ({
    ...defaults,

    devServer: {
        proxy: {
            '/start': {
                target: "https://music.youtube.com",
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/start' : ''},
            },

            '/youtubei': {
                target: "https://music.youtube.com",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://music.youtube.com",
                    "Origin": "https://music.youtube.com"
                },
            },

            '/get_video_info': {
                target: "https://www.youtube.com/",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://www.youtube.com",
                    "Origin": "https://www.youtube.com",
                },
            },

            '/watch': {
                target: "https://www.youtube.com/",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://www.youtube.com",
                    "Origin": "https://www.youtube.com",
                },
            },

            '/s': {
                target: "https://www.youtube.com/",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://www.youtube.com",
                    "Origin": "https://www.youtube.com",
                },
            }
        },

        allowedHosts: [
            '127.0.0.1',
        ],

        https: true
    },

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
        // `process.env.NODE_ENV === 'production'` must be `true` for production
        // builds to eliminate development checks and reduce build size. You may
        // wish to include additional optimizations.
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            __DEV__: process.env.NODE_ENV === 'production' || true,
        }),

        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient',
        },

        extensions: [
            '.web.jsx',
            '.web.js',
            '.web.tsx',
            '.web.ts',
            '.jsx',
            '.js',
            '.tsx',
            '.ts',
            '.json'
        ],
    },
});