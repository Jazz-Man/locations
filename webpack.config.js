var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');

var pages = [
  '404',
  'blog',
  'blog-detail',
  'contact',
  'detail',
  'detail-2',
  'index',
  'map',
  'submit',
  'profile',
  'user',
  'faq',
  'sign-in',
  'register',
  'reset-password',
  'edit-listing',
  'my-listings',
  'reviews',
  'terms-and-conditions',
  'how-it-works',
  'pricing',
  'listing-grid-3-items',
  'listing-grid-4-items',
  'listing-grid-different-widths',
  'listing-grid-full-width',
  'listing-grid-left-sidebar',
  'listing-grid-right-sidebar',
  'listing-row-left-sidebar',
  'listing-row-right-sidebar'
];

var isProd = process.env.NODE_ENV === 'production' ? true : false;

var outputPath = path.join(__dirname, 'dist');


var uglifyOption = {
  mangle: true,
  output: {
    comments: false
  },
  compress: {
    dead_code: true,
    drop_debugger: true,
    unsafe: false,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    loops: true,
    unused: true,
    hoist_funs: true,
    hoist_vars: true,
    if_return: true,
    join_vars: true,
    cascade: true,
    side_effects: true,
    warnings: false
  }
};
var extractSCSS = new ExtractTextPlugin({
  filename: 'assets/css/[name].css',
  disable: false,
  allChunks: false
});
var bootstrapGrid = new ExtractTextPlugin({
  filename: 'assets/css/bootstrap-grid.css',
  disable: false,
  allChunks: false
});

function jadePage(name) {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    mobile: true,
    title: 'uPages',
    lang: 'en',
    favicon: false,
    template: '!!pug!./src/' + name + '.pug',
    inject: false,
    homePage: "http://localhost:3000",
    injectExtras: {
      head: [
        "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
        {
          tag: 'link',
          href: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700&subset=cyrillic',
          rel: "stylesheet",
          type: "text/css"
        }
      ],
      body: [
        {
          tag: "script",
          src: "http://maps.google.com/maps/api/js?key=AIzaSyBEDfNcQRmKQEyulDN8nGWjLYPm8s4YB58&libraries=places"
        },
        "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js",
        {
          tag: "noscript",
          innerHTML: "JavaScript is disabled in your browser. <a href='http://www.enable-javascript.com/' target='_blank'>Here</a> is how to enable it."
        }
      ]
    }
  })
}

function getPlugins() {
  var plugins = [];
  
  plugins.push(
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    }),
    extractSCSS,
    bootstrapGrid,
    new StyleExtHtmlWebpackPlugin({
      file:'assets/css/bootstrap-grid.css',
      position: 'head-top'
    })
  );
  
  _.forEach(pages, function (e) {
    plugins.push(jadePage(e))
  });
  
  if (isProd) {
    plugins.push(
      new webpack.optimize.UglifyJsPlugin(uglifyOption)
    );
  }
  
  return plugins;
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    vendor: './assets/js/vendor',
    index: './assets/js'
  },
  output: {
    filename: 'assets/js/[name].js',
    chunkFilename: "assets/js/[id].chunk.js",
    path: outputPath
  },
  
  target: 'web',
  
  externals: {
    $: "jQuery",
    jquery: 'jQuery',
    google: 'google'
  },
  
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules'
    ],
    extensions: [
      '.js',
      '.pug',
      '.css',
      '.scss',
      '.png',
      '.jpg'
    ],
    alias: {
      'bootstrap.native': 'bootstrap.native/dist/bootstrap-native-v4'
    }
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  // cache: true,
  module: {
    rules: [
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'pug',
            options: {pretty: true}
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /bootstrap-grid.scss/,
        include: path.join(__dirname, 'src'),
        
        use: extractSCSS.extract({
          publicPath: '../',
          fallback: 'style',
          use: [
            {
              loader: 'css',
              options: {
                sourceMap: !isProd
              }
            },
            {
              loader: 'autoprefixer'
            },
            {
              loader: 'resolve-url',
              options: {
                root: '../',
                keepQuery: true
              }
            },
            {
              loader: 'sass',
              options: {
                sourceMap: !isProd
              }
            }
          ]
        })
      },
      {
        test: /bootstrap-grid.scss/,
        include: path.join(__dirname, 'src'),
        
        use: bootstrapGrid.extract({
          publicPath: '../',
          fallback: 'style',
          use: [
            {
              loader: 'css',
              options: {
                sourceMap: !isProd
              }
            },
            {
              loader: 'autoprefixer'
            },
            {
              loader: 'resolve-url',
              options: {
                root: '../',
                keepQuery: true
              }
            },
            {
              loader: 'sass',
              options: {
                sourceMap: !isProd
              }
            }
          ]
        })
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file',
            options: {
              name: 'assets/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg)$/,
        use: [
          {
            loader: 'file',
            options: {
              name: 'assets/img/[name].[ext]'
            }
          }
        ]
      }
    ],
    noParse: [
      /reqwest\/reqwest.js/
    ]
  },
  
  plugins: getPlugins(),
  
  devServer: {
    // noInfo: true,
    contentBase: outputPath,
    port: 3000
  }
};