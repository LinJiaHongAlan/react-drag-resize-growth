const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const nodeExternals = require('webpack-node-externals')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const config = require('./config')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const plugins = []
switch (process.env.NODE_ENV) {
  case 'development':
    plugins.push(new HtmlWebpackPlugin({
      template: './static/index.html',
      title: 'REACT-DRAGGABLE-RESIZEBLE',
    }))
    plugins.push(new ReactRefreshWebpackPlugin())
    break
  default:
    plugins.push(new CleanWebpackPlugin())
    break
}

module.exports = {
  entry: config.entry,
  devServer: {
    hot: true,
    // contentBase: [config.build.distPath, config.server.assetsPath],
    historyApiFallback: true,
    // noInfo: true,
    open: config.server.autoOpenBrowser,
    port: config.server.port,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.json']
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: 'babel-loader',
      }
    ],
  },
  plugins,
  // externals: [nodeExternals()],
  output: {
    path: config.build.distPath,
    // library: 'ReactDragResize',
    filename: '[name].js',
    libraryTarget: 'umd',
  },
}
