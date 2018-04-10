const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html引擎
//const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const config = {
    entry: {
        main: "./src/index/index.js",
        other: "./src/other/index.js",
        other2: "./src/other2/index.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'css-hot-loader', //支持热更新
                MiniCssExtractPlugin.loader,
                "css-loader"
            ]
        }, {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true // 使用缓存
                }
            }
        }]
    },
    devtool: "source-map",
    plugins: [new webpack.ProvidePlugin({ //加载jq
            $: 'jquery'
        }), new HtmlWebpackPlugin({ template: "./src/index/index.html" }),
        //new ExtractTextPlugin("[name].css"), // 样式抽离不支持热更新
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        extensions: [".js", ".json", ".jsx", ".css"]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8000,
        hot: true
    }
};
// Object.keys(config.entry).forEach(item => {
//     // 简便每次手动区配置html模板
//     new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
//         favicon: './src/img/favicon.ico',
//         filename: './view/about.html', //生成的html存放路径，相对于path
//         template: './src/view/about.html', //html模板路径
//         inject: true,
//         hash: true,
//         chunks: ['vendors', 'about'],
//     })
// })

module.exports = config;