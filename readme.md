### wepack4搭建多页面脚手架学习

前言：以前刚接触webpack的时候还是1，当时大概过了下文档操作了一下[当时写的一些注释](https://github.com/673800357/webpack-basic-config)。后来开发的时候基本写react都是用的create-react-app或者找别人的搭好的脚手架用。所以趁着找到实习后的间隙加上webpack4刚出也不算久，重新学习加复习下webpack的一些知识。


tips:
- extract-text-webpack-plugin必须4+版本才可以在webpack4中用
- webpack4中必须提供mode参数，process.env.NODE_ENV的值为production或development

目前进度：基本可用开发小型多页面。
```
npm run dev // 开发模式 8000端口
npm run build // 构建
```


### babel
- babel是不转换新的关键字那些语法。需要通过```yarn add babel-plugin-transform-runtime --dev```和``` yarn add babel-runtime --save```。再.babelrc中配置。[参考](http://babeljs.io/docs/plugins/transform-runtime/)

### css样式抽离和热更新
一般都是使用extract-text-webpack-plugin来实现css样式抽离，但是抽离的样式是不支持热更新的。所以需要mini-css-extract-plugin代替extract-text-webpack-plugin。然后使用css-hot-loader这个loader来实现。

### postcss
todo

### css_module
todo?

### 添加类似模板那样的头部、尾部、身部页面拼装
todo

### 根据src目录下的目录结构自动生成html模板和配置webpack的入口文件
这样就不需要手动去设置entry和Pugin中手动生成html了
我们约定了目录结构如下
- src\
	- index\ index页面
		- index.js 入口js文件
		- index.html
		- index.css
	- other\
		- index.js
		- index.html
		- index.css
	- other2\
		- index.js
		- index.html
		- index.css
我们要做的操作就是
1、扫描src目录下，取得index other other...这些目录名，然后把目录名作为输入的HtmlWebpackPlugin生成html的文件名，并且引用对应的js
2、设置入口的entry参数
```
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
```

### html热更新（应该说是刷新）
jq多页面应用肯定是要在页面里面写一堆html的，默认情况下webpack server html是不会热更新，html-webpack-plugin是不会触发HMR的。
通过raw-loader插件，开发模式下在每个页面的入口把页面的htmlrequire进去即可,这样就能实现热刷新了23333
```
if (process.env.NODE_ENV === "development") {
    require("./index.html");
}
```
这样每个文件引入似乎很傻。应该让工具自动化操作，应该要写个loader在指定文件开头注入上面那段代码，然后再给babel处理。根目录下自己写了个inject-loader。loader的原理其实就是接受上次的处理结果，把返回值传给下个loader使用。我们在js文件babel处理前使用该loader即可
```
{
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
}
//inject-loader.js
const path = require("path");
module.exports = function(source) {
    if (path.basename(this.resourcePath) === "index.js") {
        // 我们约定好只有index.js才会注入注入加载代码
        return `if (process.env.NODE_ENV === "development") {
        require("./index.html");
    };` + source;
    }
    return source
}
```
这样一个简单的loader就完成了2333，实现了自动化注入html热刷新代码

### 开发环境和生产环境两份配置
```
webpack -config ./webpack.xxx.js
```
webpack.base.config.js 公用配置
webpack.dev.config.js 开发环境配置
webpack.prod.config.js 生产环境配置

附：[webpack4一些迁移指南](https://github.com/dwqs/blog/issues/60)

只作为一个学习项目。一些缓存优化和分包加载方面的内容尚未考虑。todo


