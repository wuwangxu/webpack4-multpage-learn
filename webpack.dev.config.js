const webpack = require('webpack');
const path = require('path');
const base = require('./webpack.base.config');
base.devServer = {
	contentBase: path.join(__dirname, 'dist'),
	compress: true,
	port: 8000,
	hot: true
};
base.devtool = 'inline-source-map';
base.module.rules.push({
	test: /\.css$/,
	use: [
		'css-hot-loader', //支持热更新
		MiniCssExtractPlugin.loader,
		'css-loader',
		'postcss-loader'
	]
});
base.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NamedModulesPlugin());
const config = {
	...base
};
module.exports = config;
