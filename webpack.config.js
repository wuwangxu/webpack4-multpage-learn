const webpack = require("webpack");
const path = require("path");
const glob = require("glob");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理dist文件夹
const HtmlWebpackPlugin = require("html-webpack-plugin"); // html引擎
//const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const final = buildEntriesAndHTML();
const config = {
    entry: final.entries,
    output: {
        filename: "[name].js",
        path: __dirname + "/dist" //必须是绝对路径
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
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.ProvidePlugin({ //加载jq
            $: 'jquery'
        }), new HtmlWebpackPlugin({
            template: "./src/index/index.html",
            chunks: ["main"] //加载那些入口文件
        }),
        //new ExtractTextPlugin("[name].css"), // 样式抽离不支持热更新
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            ENV: JSON.stringify("233333") // 设置一些全局变量
        }), ...final.htmls
    ],
    resolve: {
        extensions: [".js", ".json", ".jsx", ".css"]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8000,
        hot: true
    },
    externals: {} // 用来配置require的返回。一般用于加载cdn
};

function buildEntries() {
    const result = glob.sync("src/**/*.js");
    return result.reduce((pre, item) => {
        const one = path.parse(item);
        return pre[one.dir.split("/").slice(-1)[0]] = item;
    }, {});
}

function buildEntriesAndHTML() {
    // 用来构建entery
    const result = glob.sync("src/**/*.js");
    const config = {
        hash: true,
        inject: true
    }
    const entries = {};
    const htmls = [];
    result.forEach(item => {
        const one = path.parse(item);
        entries[one.dir.split("/").slice(-1)[0]] = "./" + item;
        htmls.push(new HtmlWebpackPlugin({
            ...config,
            template: "./" + one.dir + "/index.html",
            chunks: [item]
        }));
    })
    return {
        entries,
        htmls
    }
}
module.exports = config;