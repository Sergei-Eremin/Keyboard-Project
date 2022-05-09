const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// const {extendDefaultPlugins} = require("svgo");

const isDev = process.env.NODE_ENV === 'development';
isProd = !isDev;

const filename = function (ext) {
    if (!isDev) return `[name].[contenthash].${ext}`

    if (isDev) return `[hash].${ext}`
}
module.exports = {
    // context: path.resolve(__dirname, 'src'),
    mode: "development",
    entry: './src/js/index.js',
    devtool: isProd ? false : "source-map",
    output: {
        filename: `./js/${filename("js")}`,
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    // devtool: false,
    // devServer: {
    //     port: 8000,

    // },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new HtmlWebpackPlugin({
            title: "webpack test bandle",
            template: "./src/index.html",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: "./src/image",
                    to: path.resolve(__dirname, 'dist/image')
                },
                {
                    from: "./src/fonts",
                    to: path.resolve(__dirname, 'dist/fonts')
                },
            ]
        }),

    ],
    module: {
        rules: [{
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                use: ["file-loader"]
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    level: {
                        1: {
                            roundingPrecision: "all=3,px=5",
                        },
                    },
                },
                minify: CssMinimizerPlugin.cleanCssMinify,
            }),
            new TerserPlugin(),

            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        // Lossless optimization with custom option
                        // Feel free to experiment with options for better result for you
                        plugins: [
                            ["gifsicle", {
                                interlaced: true
                            }],
                            ["jpegtran", {
                                progressive: true
                            }],
                            ["optipng", {
                                optimizationLevel: 5
                            }],
                            // Svgo configuration here https://github.com/svg/svgo#configuration
                            // [
                            //     "svgo",
                            //     {
                            //         plugins: extendDefaultPlugins([{
                            //                 name: "removeViewBox",
                            //                 active: false,
                            //             },
                            //             {
                            //                 name: "addAttributesToSVGElement",
                            //                 params: {
                            //                     attributes: [{
                            //                         xmlns: "http://www.w3.org/2000/svg"
                            //                     }],
                            //                 },
                            //             },
                            //         ]),
                            //     },
                            // ],
                        ],
                    },
                },
            }),
        ],
    }
};