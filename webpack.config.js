'use strict';

module.exports = {
  devtool: 'inline-source-map',
  entry: './example/index.js',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: '/build'
  },
  module: {
    loaders: [{
      test: /\.(js)$/,
      loader:  'babel',
      exclude: /node_modules/,
    }],
  },
};
