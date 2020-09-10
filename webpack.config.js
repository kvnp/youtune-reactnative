const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const OfflinePlugin = require('offline-plugin');

module.exports = (defaults) => ({
    ...defaults,

    devServer: {
        proxy: {
            '/start': {
                target: "https://music.youtube.com",
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/start' : ''},

                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
                }
            },

            '/youtubei': {
                target: "https://music.youtube.com",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://music.youtube.com",
                    "Origin": "https://music.youtube.com",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
                },
            },

            '/get_video_info': {
                target: "https://www.youtube.com/",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://www.youtube.com",
                    "Origin": "https://www.youtube.com",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
                },
            },

            '/watch': {
                target: "https://www.youtube.com/",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://www.youtube.com",
                    "Origin": "https://www.youtube.com",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
                },
            },

            '/s': {
                target: "https://www.youtube.com/",
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": "https://www.youtube.com",
                    "Origin": "https://www.youtube.com",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"
                },
            }
        },

        allowedHosts: [
            '127.0.0.1',
        ],

        historyApiFallback: true,

        //public: "https://youtune.kvnp.eu:443",
        disableHostCheck: true,
        compress: true
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
            template: './web/index.html'
        }),

        new webpack.HotModuleReplacementPlugin(),

        new WebpackPwaManifest({
            name: 'YouTune',
            short_name: 'YouTune',
            description: 'YouTube Music Frontend',
            background_color: '#2f4f4f',
            theme_color: '#2f4f4f',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            display: "fullscreen",
            icons: [
                {
                    src: './web/icon.png',
                    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                },
                {
                    src: './web/icon.png',
                    size: '1024x1024' // you can also use the specifications pattern
                },
                {
                    src: './web/icon.png',
                    size: '1024x1024',
                    purpose: 'maskable'
                }
            ],
            ios: {
                'apple-mobile-web-app-title': "YouTune",
                'apple-mobile-web-app-capable': "yes",
                'apple-mobile-web-app-status-bar-style': "black-translucent"
            }
        }),

        new OfflinePlugin()
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