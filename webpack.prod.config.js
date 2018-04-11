const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理dist文件夹
const webpack = require("webpack");
const path = require("path");
//const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const base = require("./webpack.base.config");
base.plugins.push(new CleanWebpackPlugin(['dist']));
const config = {
    ...base
};
module.exports = config;