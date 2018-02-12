var webpack = require('webpack');
var path = require('path');
var GitRevisionPlugin = require('git-revision-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR  = path.resolve(__dirname, '');

var config = {
  entry: [
    APP_DIR + '/src/app.jsx'
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.(js|jsx)$/,
        include: APP_DIR
      }
    ]
  },
  devServer: {
    /*contentBase: __dirname,*/
    open: true,
    historyApiFallback: true
  },
  bail: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  ]
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = 'source-map'
  config.devServer = {}
  config.plugins = config.plugins.concat([
    new webpack.optimize.UglifyJsPlugin(),
    new GitRevisionPlugin(),
    function () {
      this.plugin("done", function (stats) {
        if (stats.compilation.errors && stats.compilation.errors.length) {
          console.log('### Webpack build failed! ###');
          console.log(stats.compilation.errors);
          process.exit(1);
        }
      });
    }
  ]);
}

module.exports = config;
