var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var bootstrapEntryPoints = require('./bootstrap.config.js');

var extractSCSS = new ExtractTextPlugin({
  filename : 'css/[name].css?[hash]',
  allChunks: true
});

var pages = [
  'blog',
  'calculator',
  'localweather',
  'pomodoro',
  'randomquote',
  'simon',
  'tictactoe',
  'twitchtv',
  'wikiviewer',
];

function jadePage(name) {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    favicon : false,
    template: path.join(__dirname, 'src/' + name + '.pug'),
    // inject: false
  })
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry  : {
    vendor: bootstrapEntryPoints.dev,
    index : [
      './home'
    ],
  },
  output : {
    filename: 'js/[name].js',
    // chunkFilename: "assets/js/[id].js",
    path    : path.join(__dirname, 'dist'),
    publicPath: "",
  },
  
  target: 'web',
  
  resolve      : {
    modules   : [
      path.resolve(__dirname, 'src'),
      'node_modules'
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
    ]
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
    extensions      : ['.pug','.html','.js','.scss','.css','png','gif','jpeg','ttf','eot','svg','woff','woff2']
  },
  module       : {
    loaders: [
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        loader : 'pug',
        query : {
          pretty: true
        }
      },
      {
        test   : /\.scss$/,
        include: path.join(__dirname, 'src'),
        
        loader : extractSCSS.extract({
          publicPath:'../',
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
          name: 'font/[name].[ext]?[hash]'
        }
      },
      {
        test  : /\.(png|gif|jpe?g)$/,
        loader: 'file',
        query : {
          publicPath: '',
          name: 'img/[name].[ext]?[hash]'
        }
      },
    ],
  },
  
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $              : "jquery",
      jQuery         : "jquery",
      "window.jQuery": "jquery",
      Tether         : "tether",
      "window.Tether": "tether",
      Tooltip        : "exports?Tooltip!bootstrap-sass/assets/javascripts/bootstrap/tooltip",
      Alert          : "exports?Alert!bootstrap-sass/assets/javascripts/bootstrap/alert",
      Button         : "exports?Button!bootstrap-sass/assets/javascripts/bootstrap/button",
      Carousel       : "exports?Carousel!bootstrap-sass/assets/javascripts/bootstrap/carousel",
      Collapse       : "exports?Collapse!bootstrap-sass/assets/javascripts/bootstrap/collapse",
      Dropdown       : "exports?Dropdown!bootstrap-sass/assets/javascripts/bootstrap/dropdown",
      Modal          : "exports?Modal!bootstrap-sass/assets/javascripts/bootstrap/modal",
      Popover        : "exports?Popover!bootstrap-sass/assets/javascripts/bootstrap/popover",
      Scrollspy      : "exports?Scrollspy!bootstrap-sass/assets/javascripts/bootstrap/scrollspy",
      Tab            : "exports?Tab!bootstrap-sass/assets/javascripts/bootstrap/tab",
      Util           : "exports?Util!bootstrap-sass/assets/javascripts/bootstrap/util",
    }),
    
    extractSCSS,
    jadePage('home/index'),
    // jadePage('faq'),
  ],
  
  devServer: {
    contentBase: 'dist',
    port       : 8081
  }
};