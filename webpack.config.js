const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
//const {InjectManifest} = require('workbox-webpack-plugin');

const userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0";
const musicYoutube = "https://music.youtube.com";
const wwwYoutube = "https://www.youtube.com";
const imgYoutube = "https://i.ytimg.com";
const videoYoutube = "https://redirector.googlevideo.com";
const wwwYoutubeSlash = wwwYoutube + "/";

module.exports = () => ({
    devServer: {
        host: "0.0.0.0",
        port: process.env.PORT || 8080,
        public: "youtune-react.herokuapp.com",
        proxy: {
            '/start': {
                target: musicYoutube,
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/start' : ''},

                headers: {
                    "User-Agent": userAgent
                }
            },

            '/youtubei': {
                target: musicYoutube,
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": musicYoutube,
                    "Origin": musicYoutube,
                    "User-Agent": userAgent
                },
            },

            '/get_video_info': {
                target: wwwYoutubeSlash,
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                },
            },

            '/watch': {
                target: wwwYoutubeSlash,
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                },
            },

            '/s': {
                target: wwwYoutubeSlash,
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                },
            },

            '/video': {
                target: videoYoutube,
                changeOrigin: true,
                secure: false,
                followRedirects: true,
                pathRewrite: {'^/video' : ''},

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                }
            },

            '/vi': {
                target: imgYoutube,
                secure: true,
                changeOrigin: true,

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                }
            },
        },

        historyApiFallback: true,
        compress: true
    },

    entry: {
        app: './index.web.js',
        index: [
            'react-native-webpack/clients/polyfills.js'
        ]
    },

    output: {
        path: __dirname + '/dist',
        filename: 'app-[chunkhash].bundle.js',
        publicPath: '/'
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
                test: /\.(png|jpe?g|gif|ico|ttf|css)$/i,
                loader: 'file-loader',
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
            template: './web/index.html',
            filename: 'index.html'
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