const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const { GenerateSW } = require('workbox-webpack-plugin');

const userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0";
const musicYoutube = "https://music.youtube.com";
const wwwYoutube = "https://www.youtube.com";
const imgYoutube = "https://i.ytimg.com";
const videoYoutube = "https://redirector.googlevideo.com";

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = "development";

module.exports = () => ({
    devServer: {
        host: "0.0.0.0",
        port: process.env.PORT || 8080,
        public: process.env.PORT
            ? "utune.herokuapp.com"
            : undefined,

        proxy: {
            '/proxy/get_video_info': {
                target: wwwYoutube,
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/proxy' : ''},

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                },
            },

            '/proxy/videoplayback': {
                target: videoYoutube,
                changeOrigin: true,
                secure: false,
                followRedirects: true,
                pathRewrite: {'^/proxy' : ''},

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                }
            },

            '/proxy/vi': {
                target: imgYoutube,
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/proxy' : ''},

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                }
            },

            '/proxy/lh3/': {
                target: "https://lh3.googleusercontent.com",
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/proxy/lh3/' : ''},

                headers: {
                    "Referer": wwwYoutube,
                    "Origin": wwwYoutube,
                    "User-Agent": userAgent
                }
            },

            '/proxy/': {
                target: musicYoutube,
                secure: true,
                changeOrigin: true,
                pathRewrite: {'^/proxy' : ''},

                headers: {
                    "Referer": musicYoutube,
                    "Origin": musicYoutube,
                    "User-Agent": userAgent
                }
            }
        },

        historyApiFallback: true,
        compress: true,

        /*watchOptions: {
            ignored: [
                "./.git",
                "./node_modules",
                "./.github",
                "./android",
                "./ios"
            ]
        }*/
    },
    
    mode: process.env.NODE_ENV,
    entry: {
        app: './index.web.js'
    },

    optimization: {
        nodeEnv: process.env.NODE_ENV,
        minimize: process.env.NODE_ENV == "production",
        minimizer: [ new TerserPlugin() ],

        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },

        runtimeChunk: 'multiple',
        moduleIds: 'deterministic',
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
            filename: 'index.html',
            minify: true
        }),

        process.env.NODE_ENV != "production"
            ? new webpack.HotModuleReplacementPlugin()
            : () => {},

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

        new GenerateSW(
            {
                mode: process.env.NODE_ENV,
                navigateFallback: "/index.html",
                maximumFileSizeToCacheInBytes: 3e+6,
                cleanupOutdatedCaches: true,
                clientsClaim: true,
                runtimeCaching: [
                    {
                        urlPattern: /\.(?:ico|html|js|css|json)$/,
                        handler: "CacheFirst",

                        options: {
                            cacheName: "main"
                        }
                    },

                    {
                        urlPattern: /\.(?:png|jpg|jpeg)$/,
                        handler: "CacheFirst",

                        options: {
                            cacheName: "images",

                            expiration: {
                                maxEntries: 50,
                            }
                        }
                    },

                    {
                        urlPattern: "/proxy/*",
                        handler: "NetworkFirst",

                        options: {
                            cacheName: "proxy"
                        }
                    }
                ],
            }
        )
    ],
    
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            'react-native-linear-gradient': 'react-native-web-linear-gradient',
            'react-native-track-player': 'react-native-track-player-web'
        },

        extensions: [
            '.web.jsx',
            '.web.js',
            '.web.tsx',
            '.web.ts',
            '.jsx',
            '.js',
            '.tsx',
            '.ts'
        ],
    },
});