const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: __dirname + "/app/main.jsx",  //唯一入口文件
    output: {
        path: __dirname + "/build",  //打包后的文件存放的地方
        filename: "bundle.js"  //打包后输出文件的文件名
    },

    devtool: 'eval-source-map',  //生成Source Maps（使调试更容易）

    devServer: {  //构建本地服务器
        contentBase: "./build",  //本地服务器所加载的页面所在的目录
        historyApiFallback: true,  //不跳转
        inline: true,  //实时刷新
        hot: true
    },

    module: {  //Loaders
        rules: [
            //js、jsx处理
            {
                test: /(\.jsx|\.js)$/,  //用以匹配loaders所处理文件的拓展名的正则表达式（必须）
                use:[
                    {
                        loader: "babel-loader"  //loader的名称（必须）
                    }
                ],
                exclude: /node_modules/  //include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
            },
            //css处理
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    }, {
                        loader: "css-loader",
                        options: {
                            modules: true  //类名只作用于当前模块
                        }
                    }, {
                        loader: "postcss-loader"
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    //插件
    plugins: [
        new HtmlWebpackPlugin({   //依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html
            template: __dirname + "/app/index.html"
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         properties: false,
        //         warnings: false
        //     },
        //     output: {
        //         beautify: true,
        //         quote_keys: true
        //     },
        //     mangle: {
        //         screw_ie8: false
        //     },
        //     sourceMap: false
        // })
    ]
};