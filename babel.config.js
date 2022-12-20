module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    ['@babel/preset-react'],
    ['@babel/preset-typescript']
  ],
  plugins: [
    // 热更新
    // ['react-refresh/babel']
  ],
}
