module.exports = {
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'prettier/standard',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  env: {
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/export': 'off',
    'no-array-constructor': 'off'
  }
}
