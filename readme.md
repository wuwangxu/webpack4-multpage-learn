### wepack4搭建多页面脚手架学习

前言：以前刚接触webpack的时候还是1，当时大概过了下文档操作了一下。后来开发的时候基本都直接用脚手架。所以趁着webpack4刚出不久，重新学习加复习下。


tips:
- extract-text-webpack-plugin必须4+版本才可以在webpack4中用

目前进度：。。。未完成


### babel
- babel是不转换新的关键字那些语法。需要通过```yarn add babel-plugin-transform-runtime --dev```和``` yarn add babel-runtime --save```。再.babelrc中配置。[参考](http://babeljs.io/docs/plugins/transform-runtime/)

### css样式抽离和热更新
一般都是使用extract-text-webpack-plugin来实现css样式抽离，但是抽离的样式是不支持热更新的。所以需要mini-css-extract-plugin代替extract-text-webpack-plugin。然后使用css-hot-loader这个loader来实现。

### 根据src目录下的目录结构自动生成html模板和配置webpack的入口文件
todo

### html热更新（应该说是刷新）
jq多页面应用肯定是要在页面里面写一堆html的，默认情况下webpack server html是不会热更新。
todo

只作为一个学习项目。一些缓存优化和分包加载方面的内容尚未考虑。todo
