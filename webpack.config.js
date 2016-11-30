var path = require('path');
var webpack = require('webpack');
var faker = require('faker');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var extractSCSS = new ExtractTextPlugin({
  filename : 'css/[name].css?[hash]',
  // disable: true,
  allChunks: true
});

var outputPath = '/home/jazzman/nginxstack/apps/upages/wp-content/themes/upages/assets/';

function htmlPage(name) {
  return new HtmlWebpackPlugin({
    filename    : 'assets/external/' + name + '.html?[hash]',
    favicon : false,
    template    : './assets/external/' + name + '.pug',
    inject      : false,
  })
}

var wpAjax = {
  url:'http://localhost:8080/upages/wp-admin/admin-ajax.php'
};

function jadePage(name) {
  return new HtmlWebpackPlugin({
    filename    : name + '.html?[hash]',
    mobile      : true,
    title       : 'App',
    lang        : 'en',
    favicon : false,
    template    : '!!pug!./src/' + name + '.pug',
    inject      : false,
    injectExtras: {
      head: [
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
        {
          "tag" : 'link',
          "href": 'https://fonts.googleapis.com/css?family=Lato:400,300,700,900,400italic',
          "rel" : "stylesheet",
          "type": "text/css"
        }
      ],
      body: [
        {
          "tag": "script",
          "innerHTML": "var wpAjax = {url:'http://localhost:8080/upages/wp-admin/admin-ajax.php'}",
          "type": "text/javascript"
        },
        {
          "tag": "script",
          "src": "http://maps.google.com/maps/api/js?key=AIzaSyBEDfNcQRmKQEyulDN8nGWjLYPm8s4YB58&libraries=places"
        },
        "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js",
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
        {
          "tag"      : "noscript",
          "innerHTML": "JavaScript is disabled in your browser. <a href='http://www.enable-javascript.com/' target='_blank'>Here</a> is how to enable it."
        }
      ]
    }
  })
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry  : {
    index: [
      './index'
    ],
  },
  output : {
    filename     : 'js/[name].js',
    chunkFilename: "js/[id].js",
    path         : outputPath,
    publicPath   : "wp-content/themes/upages/assets/",
  },
  
  target: 'web',
  
  externals: { // object
    $     : "jQuery",
    jquery: 'jQuery',
    google: 'google'
  },
  
  resolve      : {
    modules   : [
      path.resolve(__dirname, 'src'),
      'node_modules',
      'bower_components'
    ],
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
    alias:{
      'trackpad-scroll-js':'trackpad-scroll-emulator/jquery.trackpad-scroll-emulator.js',
      'trackpad-scroll-css':'trackpad-scroll-emulator/css/trackpad-scroll-emulator.css',
      'nouislider_js':'nouislider/distribute/jquery.nouislider.all.js',
      'countdown':'countdown/dist/jquery.countdown.js',
      'zabuto_calendar_js':'zabuto_calendar/zabuto_calendar.js',
      'zabuto_calendar_css':'zabuto_calendar/zabuto_calendar.css'
    }
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
    extensions      : [
      '.pug',
      '.html',
      '.js',
      '.scss',
      '.css',
      'png',
      'gif',
      'jpeg',
      'ttf',
      'eot',
      'svg',
      'woff',
      'woff2'
    ]
  },
  module       : {
    loaders: [
      {
        test  : /\.coffee$/,
        exclude: /node_modules/,
        loader: 'coffee',
        query:{
          
        }
      },
      {
        test   : /\.pug$/,
        exclude: /node_modules/,
        loader : 'pug',
        query  : {
          pretty: true
        }
      },
      {
        test   : /\.scss$/,
        include: path.join(__dirname, 'src'),
        
        loader: extractSCSS.extract({
          publicPath    : '../',
          fallbackLoader: 'style',
          loader        : [
            {
              loader: 'css',
              query : {
                sourceMap: true
              }
            },
            {
              loader: 'resolve-url',
              query : {
                root     : '../',
                keepQuery: true
              }
            },
            {
              loader: 'sass',
              query : {
                sourceMap   : true,
                includePaths: path.resolve(__dirname, "src")
              }
            },
          ]
        })
      },
      {
        test  : /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file',
        query : {
          publicPath: '',
          name      : 'font/[name].[ext]?[hash]'
        }
      },
      {
        test  : /\.(png|gif|jpg|jpeg)$/,
        loader: 'file',
        query : {
          publicPath: '',
          name      : 'img/[name].[ext]?[hash]'
        }
      },
    ],
  },
  
  plugins: [
    new webpack.NoErrorsPlugin(),
    new WriteFilePlugin(),
    new webpack.ProvidePlugin({
      $              : "jquery",
      jQuery         : "jquery",
      "window.jQuery": "jquery"
    }),
    // new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"]),
    
    extractSCSS,
    jadePage('index'),
    jadePage('map'),
    jadePage('detail'),
    jadePage('contact'),
    jadePage('404'),
    jadePage('blog'),
    jadePage('blog-detail'),
    
    // htmlPage('data'),
    htmlPage('email'),
    htmlPage('infobox'),
    htmlPage('modal_item'),
    htmlPage('modal_register'),
    htmlPage('modal_reset_password'),
    htmlPage('modal_sign_in'),
    htmlPage('modal_submit'),
    htmlPage('sidebar_detail'),
    htmlPage('sidebar_results'),
  ],
  
  devServer: {
    noInfo: true,
    contentBase: outputPath,
    port       : 8081
  }
};