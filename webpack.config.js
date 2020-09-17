const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/dist',
    libraryTarget: 'commonjs2'
  },
  externals: {
    react: "react"
  }
};