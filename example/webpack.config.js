'use strict';

module.exports = {
  devtool: 'inline-source-map',
  entry: __dirname + '/index.js',
  output: {
    filename: __dirname + '/build/bundle.js'
  },
  module: {
    loaders: [{
      test: /\.(js)$/,
      loader:  'babel',
      exclude: /node_modules/,
    }],
  },
};
