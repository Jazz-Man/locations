const path = require('path')
const webpack = require('webpack')
const forEach = require('lodash/forEach')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const pages = [
  '404',
  'blog',
  'blog-detail',
  'contact',
  'detail',
  'detail-2',
  'index',
  'index-map-version-1',
  'index-map-version-2',
  'index-map-version-3',
  'index-map-version-4',
  'submit',
  'profile',
  // 'user',
  'faq',
  'sign-in',
  'register',
  'reset-password',
  'edit-listing',
  'my-listings',
  'reviews',
  'terms-and-conditions',
  // 'how-it-works',
  'pricing',
  'listing-grid-3-items',
  'listing-grid-4-items',
  'listing-grid-different-widths',
  'listing-grid-full-width',
  'listing-grid-left-sidebar',
  'listing-grid-right-sidebar',
  'listing-row-left-sidebar',
  'listing-row-right-sidebar'
]

const isProd = process.env.NODE_ENV === 'production'

const outputPath = path.join(__dirname, 'dist')

const extractSCSS = new ExtractTextPlugin({
  filename: 'css/[name].css',
  disable: false,
  allChunks: true
})

function jadePage(name) {
  return new HtmlWebpackPlugin({
    filename: name + '.html',
    mobile: true,
    title: 'uPages',
    lang: 'en',
    favicon: false,
    template: '!!pug!./src/' + name + '.pug',
    // inject: false,
    // homePage: "http://localhost:3000",
  })
}

function getPlugins() {
  const plugins = []

  plugins.push(
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
    // bootstrapGrid,
    // new StyleExtHtmlWebpackPlugin({
    //   filename:'assets/css/inline.css',
    //   position:'head-top'
    // })
  );
  
  forEach(pages, function (e) {
    plugins.push(jadePage(e))
  });

  
  return plugins;
}

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    jquery:[
      'jquery',
      'jquery-migrate'
    ],
    vendor: [
    	'expose?window.bsn!bootstrap.native'
    ],
    index: [
      './assets/js',
      './assets/scss'
    ]
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: "js/[id]-[name].chunk.js",
    path: outputPath,
    // publicPath: '/assets/',
    pathinfo: true
  },
  
  target: 'web',
  
  externals: {
    $: "jQuery",
    jquery: 'jQuery',
    google: 'google'
  },
  
  resolve: {
    modules: [
      'src',
      'modules',
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
      'bootstrap.native': 'bootstrap.native/dist/bootstrap-native-v4',
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
        // exclude: /node_modules/,
        use: [
          {
            loader: 'pug',
            options: {
              pretty: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'src'),
        use: extractSCSS.extract({
          // publicPath: '/assets/',
          fallback: 'style',
          use: [
            {
              loader: 'css',
              // options: {
              //   sourceMap: !isProd
              // }
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
              publicPath: '/assets/',
              name: 'fonts/[name].[ext]'
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
              publicPath: '/assets/',
              name: 'img/[name].[ext]'
            }
          }
        ]
      }
    ],
  },
  
  plugins: getPlugins(),
  
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true" },
    contentBase: outputPath,
    port: 3000
  }
};