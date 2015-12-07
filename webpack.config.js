'use strict';

var merge = require('webpack-merge');
var base = require('./webpack.config.base');

module.exports = merge(base, {
  devtool: 'inline-source-map',
  entry: './example/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: '/build'
  },
});
