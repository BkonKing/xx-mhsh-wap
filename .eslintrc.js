module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    ecmaVersion: 6,
    parser: 'babel-eslint'
  },
  rules: {
    'eqeqeq': 'off',
    'writeable': 'off',
    'no-nested-ternary': 'off',
    'camelcase': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  globals: {
    '$api': true,
    'api': true
  }
}
