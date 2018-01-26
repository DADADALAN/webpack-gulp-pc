var gulp = require('gulp'),  
    url = require('url'),
    //connect
    proxy = require('proxy-middleware'),
    connect = require('gulp-connect'),
    webpack = require("gulp-webpack"),
    //style
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    px2rem = require('gulp-px2rem'),
    cssmin = require('gulp-cssmin'),
    md5 = require('md5'),
    pkg = require('./package.json'),
    /*项目md5*/
    projectMd5 = md5(pkg.name + pkg.version).substring(0,8),
    //img
    image = require('gulp-image'),
    //del
    del = require('del'),
    ejs = require('gulp-ejs'),
    //spriter
    spriters = require('gulp-spriters');

var path = {};
path.root = './';
path.html = path.root + 'html/'
path.ejs = path.root + 'view/'
path.font = path.root + 'font/'
path.img = path.root + 'img/'
path.js = path.root + 'js/'
path.sass = path.root + 'sass/'
path.lib = path.root + 'lib/'
path.build = path.root + 'build/'+ projectMd5
path.webpackConfig = './webpack.config.js'
//静态资源路径
path.staticUrl = `/${projectMd5}`
path.libUrl = ""

    function clean() {
        return del([path.build + '*'])
    }

    function getRepoName(){
        var isWin = /^win/.test(process.platform);
        if(isWin){
            repoName = __dirname.split('\\').reverse()[0]
        }
        else{
            repoName = __dirname.split('/').reverse()[0]
        }
        return repoName;
    }

    function connectServer(cb) {
        var port = 9527;
        var repoName = getRepoName();
        connect.server({
            root: './build',
            port: port,
            livereload: true,
            middleware: function(connect,opt){
                //此处对服务器做了代理，目的是为了让开发环境访问路径和上线路径保持一致
                //还可以做接口的代理，当然这些可以也可以通过nginx来做到
                // var optionStatic = url.parse('http://127.0.0.1:8080');
                // optionStatic.route = '//';
                // 联调接口，请放开下面的注释，并配置对接后端的api域名，host需要自己在switchHost工具中配置
                var optionApi = url.parse('http://127.0.0.1:8080');
                optionApi.route = '/api';
                return [
                    // proxy(optionStatic),
                    proxy(optionApi)
                ]
            }
        });
        cb();
    }

    function reload () {
        return gulp.src([path.html + '**/*.html',
            path.sass + '**/*.scss',
            path.js + '**/*.js',
            path.img + '**/*.*'])
            .pipe(connect.reload())
    }

    function compileStyle() {
        return gulp.src([path.sass + '**/*.scss','!' + path.sass + '**/_*.scss'])
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(spriters())
        .pipe(cssmin({
            compatibility:"ie7"
        }))
        .pipe(gulp.dest(path.build + '/css/'))
    }

    function compileHtml() {
        return gulp.src(path.html + '**/*.html',{base: './'})
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(ejs({
            staticUrl: path.staticUrl,
            libUrl: path.libUrl
        },{ext: '.html'}))
        .pipe(gulp.dest('./build/'))
        .on("end",function(){
        });
    }

    function compileJS(cb) {
        gulp.src(path.js + '/entry/*.js')
        .pipe(webpack(require(path.webpackConfig)))
        .pipe(gulp.dest(path.build + '/js/'));
        cb();
    }

    function minImage() {
        return gulp.src(path.img + '**/*.*',{base: path.root})
        .pipe(image())
        .pipe(gulp.dest(path.build));
    }

    function copyLib() {
        return gulp.src(path.lib + '**/*.*',{base: path.root})
        .pipe(gulp.dest('./build/'));
    }

    function copyFont() {
        return gulp.src(path.font + '**/*',{base: './'})
        .pipe(gulp.dest('./build/'));
    }

    /*样式预处理编译，雪碧图合并*/
    // gulp.task('style-h5', function () {
    //   return gulp.src([path.sass + '**/*.scss','!' + path.sass + '**/_*.scss'])
    //     .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
    //     .pipe(autoprefixer())
    //     .pipe(sass())
    //     .pipe(spriters())
    //     .pipe(px2rem({
    //         rootValue: 20,
    //         replace: true
    //         // propertyBlackList: []
    //         // propertyWhiteList: ['background-size','background','width','height']
    //     }))
    //     .pipe(cssmin())
    //     .pipe(gulp.dest(path.build + '/css/'));
    // });

    function getWatch(cb) {
        gulp.watch(['html/**/*.html'], compileHtml);
        //ejs模板
        gulp.watch(['view/**/*.html'], gulp.series(
            compileHtml,
            gulp.parallel(
                reload
            )
        ));
        gulp.watch(['sass/**/*.scss'], compileStyle);
        gulp.watch(['img/**/*.*'], minImage);
        gulp.watch(['html/**/*.html',
            path.sass + '**/*.scss',
            './build/**/*.js',
            path.img + '**/*.*'],reload)
        cb();
    }

    function doMd5(cb) {
        var versonMd5 = md5(pkg.name + pkg.version)
        console.log(versonMd5.substring(0,8))
        cb();
    }

    //release初始化webpack配置
    function initReleaseConfig(cb) {
        path.webpackConfig = './webpack.config.release.js'
        path.staticUrl = `${pkg.staticUrl}/${projectMd5}`
        path.libUrl = pkg.staticUrl
        cb();
    }

    gulp.task('default', gulp.series(
        clean,
        gulp.parallel(
            minImage,
            compileStyle,
            compileHtml,
            compileJS,
            copyFont,
            copyLib
        ),
        getWatch,
        connectServer,
        reload
    ));

    gulp.task('release',gulp.series(
        clean,
        initReleaseConfig,
        gulp.parallel(
            minImage,
            compileStyle,
            compileHtml,
            compileJS,
            copyFont,
            copyLib
        ))
    );

    gulp.task('version', doMd5);


