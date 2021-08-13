module.exports = {
  plugins: ['jest', 'jest-dom'],
  extends: [
    'plugin:jest/recommended',
    'plugin:jest-dom/recommended',
    'plugin:testing-library/dom',
  ],
  rules: {
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
  },
}
