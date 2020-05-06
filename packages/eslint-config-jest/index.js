module.exports = {
  overrides: [
    {
      files: ['__mocks__/**/*.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
      env: {
        jest: true,
      },
      rules: {
        'no-restricted-globals': [
          'error',
          {
            name: 'fit',
            message: 'Use it instead.',
          },
          {
            name: 'fdescribe',
            message: 'Use describe instead.',
          },
        ],
        'no-restricted-properties': [
          'error',
          {
            object: 'describe',
            property: 'only',
            message: 'Use describe instead.',
          },
          {
            object: 'it',
            property: 'only',
            message: 'Use it instead.',
          },
          {
            object: 'test',
            property: 'only',
            message: 'Use test instead.',
          },
        ],
      },
    },
  ],
}
