module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier/react'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
