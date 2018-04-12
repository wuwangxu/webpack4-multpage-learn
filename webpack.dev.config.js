const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html引擎
//const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const base = require("./webpack.base.config");
base.devServer = {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000,
    hot: true
};
base.devtool = "inline-source-map";
base.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin());
base.module.rules.push({
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: [{
        loader: 'babel-loader',
        options: {
            cacheDirectory: true // 使用缓存
        }
    }, {
        loader: path.resolve("./inject-loader.js") // 开发模式使用注入代码实现html热更新
    }]
});
const config = {
    ...base
};
module.exports = config;