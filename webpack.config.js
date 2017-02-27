var path = require('path');
var webpack = require('webpack');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  'listing-row-right-sidebar',
];

var externalPage = [
  'email',
  'infobox',
  'modal_item',
  'modal_register',
  'modal_reset_password',
  'modal_sign_in',
  'modal_submit',
  'sidebar_detail',
  'sidebar_results'
];

// var env = process.env.NODE_ENV;
var isProd = process.env.NODE_ENV === 'production' ? true : false;

var outputPath;

 if (isProd === false) {
outputPath = path.join(__dirname, 'dist');
 }
 else {
   outputPath = '/home/jazzman/lampstack/apps/upages/htdocs/wp-content/themes/upages';
 }

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
  filename: 'css/[name].css',
  disable: false,
  allChunks: true
});

function htmlPage(name) {
  return new HtmlWebpackPlugin({
    filename: 'assets/external/' + name + '.html',
    favicon: false,
    template: './assets/external/' + name + '.pug',
    inject: false
  })
}

function jadePage(name) {
  return new HtmlWebpackPlugin({
    filename: isProd ? 'assets/' + name + '.html' : name + '.html',
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
          innerHTML: "var upages_params = {url:'http://localhost:8080/upages/wp-admin/admin-ajax.php'}",
          type: "text/javascript"
        },
        {
          tag: "script",
          src: "http://maps.google.com/maps/api/js?key=AIzaSyBEDfNcQRmKQEyulDN8nGWjLYPm8s4YB58&libraries=places"
        },
        "https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js",
        // "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
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
    extractSCSS
  );
  
  _.forEach(pages, function (e) {
    plugins.push(jadePage(e))
  });
  
  _.forEach(externalPage, function (e) {
    plugins.push(htmlPage(e))
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
    path: outputPath,
    publicPath: "/assets/",
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
      '.jpg',
    ],
    alias: {
      'bootstrap.native': 'bootstrap.native/dist/bootstrap-native-v4'
    }
  },
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
  cache: true,
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
        ],
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'src'),
        
        use: extractSCSS.extract({
          publicPath: '../',
          fallback: 'style',
          use: [
            {
              loader: 'css',
              options: {
                camelCase: true,
                sourceMap: true
              }
            },
            {
              loader: 'autoprefixer',
              options: {
                browsers: [
                  "android >= 4.4",
                  "chrome >= 20",
                  "ff >= 20",
                  "ie > 8",
                  "ie_mob >= 10",
                  "safari > 6",
                  "ios > 6"
                ],
                add: true,
                remove: true
              }
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
                sourceMap: true,
                includePaths: path.resolve(__dirname, "src")
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
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|gif|jpg|jpeg)$/,
        use:[{
          loader: 'file',
          options: {
            name: 'img/[name].[ext]'
          }
        }]
      }
    ],
    noParse: [
      /reqwest\/reqwest.js/,
    ]
  },
  
  plugins: getPlugins(),
  
  devServer: {
    // noInfo: true,
    contentBase: outputPath,
    port: 3000
  }
};