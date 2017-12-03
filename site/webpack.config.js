var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR  = path.resolve(__dirname, '');

var config = {
  entry: [
    APP_DIR + '/index.jsx'
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
    open: true
  }
};

module.exports = config;
