const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清理dist文件夹
const HtmlWebpackPlugin = require('html-webpack-plugin'); // html引擎
//const ExtractTextPlugin = require('extract-text-webpack-plugin'); //抽离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const final = buildEntriesAndHTML();
const base = {
	entry: final.entries,
	output: {
		filename: '[name]/[name].js',
		path: __dirname + '/dist' //必须是绝对路径
	},
	module: {
		rules: [
			{
				// 为了方便这个放在第一位
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'file-loader'
					}
				]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader', // base64
						options: {
							limit: 8192
						}
					}
				]
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							cacheDirectory: true // 使用缓存
						}
					},
					{
						loader: path.resolve('./inject-loader.js') // 开发模式使用注入代码实现html热更新，注入normalize.css
					}
				]
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
						options: {
							interpolate: 'require'
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new webpack.ProvidePlugin({
			//加载jq
			$: 'jquery'
		}),
		//new ExtractTextPlugin("[name].css"), // 样式抽离不支持热更新
		new MiniCssExtractPlugin({
			filename: '[name]/[name].css',
			chunkFilename: '[id].css'
		}),
		...final.htmls
	],
	resolve: {
		extensions: ['.js', '.json', '.jsx', '.css']
	},
	externals: {} // 用来配置require的返回。一般用于加载cdn
};

function buildEntriesAndHTML() {
	// 用来构建entery
	const result = glob.sync('src/**/*.js');
	const config = {
		hash: true,
		inject: true
	};
	const entries = {};
	const htmls = [];
	result.forEach(item => {
		const one = path.parse(item);
		const outputfile = one.dir.split('/').slice(-1)[0];
		entries[outputfile] = './' + item;
		htmls.push(
			new HtmlWebpackPlugin({
				...config,
				template: './' + one.dir + '/index.html',
				filename: outputfile === 'index' ? './index.html' : './' + outputfile + '/index.html', // 输出html文件的路径
				chunks: [outputfile]
			})
		);
	});
	return {
		entries,
		htmls
	};
}
module.exports = base;
