var NODE_ENV = process.env.NODE_ENV || "development";
var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    context: path.join(__dirname, 'src'),

    entry: ["./assets/js/jquery-2.2.1.min.js"],
    output: {
        path: path.join(__dirname, 'dist'),
        // publicPath: 'assets/',
        pathinfo: true,
        filename: 'assets/js/[name].js',
        sourcePrefix: "\t"
    },

    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: [
            '.js',
            '.coffee',
            '.html',
            '.pug',
            '.css',
            '.scss',
            '.png',
            '.jpg',
            '.gif'
        ],
        symlinks: true,
    },

    resolveLoader:{
        moduleExtensions: ["-loader"],
        extensions: [".js"],
        // packageMains: ["webpackLoader", "webLoader", "loader", "main"]
    },


    target: 'web',
    
    module: {
        loaders: [
        {
          test: /\.pug$/,
          loaders: [
            'html',
            'pug-html?exports=false,pretty'
            ],
        },
        {
          test: /\.css$/,loaders: [
                'file?name=assets/css/[name].css',
                'style',
                'css',
                'resolve-url'
            ],
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract('css?sourceMap!resolve-url!sass?outputStyle=expanded&sourceMap'),
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)$/,
            loader: 'file',
            query: {
                name: 'assets/fonts/[name].[ext]'
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'file',
            query: {
                name: 'assets/img/[name].[ext]'
            }
        }]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV),
            LANG: JSON.stringify('ru'),
            VERSION: JSON.stringify("5fa3b9"),
        }),
        // new webpack.ResolverPlugin(
        //   new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        // ),
        new HtmlWebpackPlugin({
            favicon: 'upages.ico',
            template: 'index.pug',
            title: 'Webpack App',
            template: 'index.pug',
        }),
        new ExtractTextPlugin({
            // filename : "assets/css/[name].css",
            allChunks: true,
        }),
    ],

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
    }
};

if (NODE_ENV == 'production') {
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            output: {
                comments: false // output comments?
            },
            compress: {
                dead_code: true, // discard unreachable code
                drop_debugger: true, // discard “debugger” statements
                unsafe: false, // some unsafe optimizations (see below)
                conditionals: true, // optimize if-s and conditional expressions
                comparisons: true, // optimize comparisons
                evaluate: true, // evaluate constant expressions
                booleans: true, // optimize boolean expressions
                loops: true, // optimize loops
                unused: true, // drop unused variables/functions
                hoist_funs: true, // hoist function declarations
                hoist_vars: true, // hoist variable declarations
                if_return: true, // optimize if-s followed by return/continue
                join_vars: true, // join var declarations
                cascade: true, // try to cascade `right` into `left` in sequences
                side_effects: true, // drop side-effect-free statements
                warnings: false // warn about potentially dangerous optimizations/code
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: "common",
            filename: '[name].js',
            children: true
        })
    )
}
