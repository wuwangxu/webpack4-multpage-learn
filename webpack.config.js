const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html引擎
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css

const config = {
    entry: {
        main: "./src/index/index.js",
        other: "./src/other.js"
    },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, ]
    },
    plugins: [new HtmlWebpackPlugin({ template: "./src/index/index.html" }), new ExtractTextPlugin("[name].css"), new webpack.HotModuleReplacementPlugin()],
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
module.exports = config;