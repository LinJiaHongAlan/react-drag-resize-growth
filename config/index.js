var path = require('path');
var envConfig = null
switch (process.env.NODE_ENV) {
  case 'development':
    envConfig = require('./dev.conf')
    break
  case 'testing':
    envConfig = require('./test.conf')
    break
  default:
    envConfig = require('./prod.conf');
    break
}

// 递归复制
var deepExtend = require('deep-extend');

module.exports = deepExtend({
    build: {
        distPath: path.resolve(__dirname, '../dist'),
        bundleAnalyzerReport: false
    },
    server: {
        assetsPath: path.resolve(__dirname, '../static'),
        port: 8085,
        host: '0.0.0.0',
        autoOpenBrowser: true,
    }
}, envConfig);