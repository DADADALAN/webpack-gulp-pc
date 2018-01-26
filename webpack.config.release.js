var path = require('path');
var webpack = require('webpack'),
    rd = require('rd');


var entryPath = './js/entry/',
    distPath  = './build/js/',
    entryPathConfig = {};

var devEntry = 1;

/*读取入口文件入口js，配置到webpack配置*/
rd.eachFileFilterSync(entryPath, /\.js$/, function (f, s) {
    var _filename = path.basename(__dirname + f, '.js');
    entryPathConfig[_filename] = entryPath + _filename + '.js';
});


module.exports = {
    // devtool: "source-map",  
    // watch: true,
    entry: entryPathConfig ,
    output: {   
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.tpl$/,
                loader: "tmodjs"
            }
        ]
    },
    resolve: {
        alias: {
            
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

};







