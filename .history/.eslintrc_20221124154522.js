module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended'
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    quotes: [2, 'single'], // 单引号
    semi: [2, 'never'], // 不使用分号
    'space-before-function-paren': [2, 'always'], // 函数前面加上空格
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'max-len': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    'consistent-return': 'off',
    'react/forbid-prop-types': 'off'
  }
}
