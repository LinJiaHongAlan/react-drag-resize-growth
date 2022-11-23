const webpack = require('webpack')
const config = require('./config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
console.log(config.plugins)

const plugins = []
switch (process.env.NODE_ENV) {
  case 'development':
    plugins.push(new HtmlWebpackPlugin({
      template: './static/index.html',
      title: 'REACT-DRAGGABLE-RESIZEBLE'
    }))
    plugins.push(new ReactRefreshWebpackPlugin())
    break
  default:
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
    port: config.server.port
  },
  // externals: {
  //   'react': {
  //     'commonjs': 'react',
  //     'commonjs2': 'react',
  //     'amd': 'react',
  //     // React dep should be available as window.React, not window.react
  //     'root': 'React'
  //   },
  //   'react-dom': {
  //     'commonjs': 'react-dom',
  //     'commonjs2': 'react-dom',
  //     'amd': 'react-dom',
  //     'root': 'ReactDOM'
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: "babel-loader"
      }
    ]
  },
  plugins: plugins,
  output: {
      path: config.build.distPath,
      // library: 'ReactDragResize',
      filename: '[name].js',
      libraryTarget: 'umd'
  }
}