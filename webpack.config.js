'use strict';

var merge = require('webpack-merge');
var base = require('./webpack.config.base');

module.exports = merge(base, {
  devtool: 'inline-source-map',
  entry: {
    'static-data': './examples/static-data/index.js',
    'async-data': './examples/async-data/index.js',
    'multi-data': './examples/multi-data/index.js'
  },
  output: {
    path: __dirname + '/build',
    filename: '[name].bundle.js',
    publicPath: '/build'
  },
});
