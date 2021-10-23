# @pacote/eslint-config-jest

![version](https://badgen.net/npm/v/@pacote/eslint-config-jest)
![minified](https://badgen.net/bundlephobia/min/@pacote/eslint-config-jest)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/eslint-config-jest)

Shareable ESLint configuration for Jest.

## Installation

```bash
yarn add --dev @pacote/eslint-config-jest eslint eslint-plugin-jest-dom eslint-plugin-jest eslint-plugin-testing-library
```

## Usage

Include the configuration in your project's `.eslintrc` file:

```json
{
  "extends": ["@pacote/eslint-config-jest"]
}
```

## Testing Library

Because many Testing Library packages exist, linting rules are not included in
shareable configuration and should be imported manually. For example:

```json
{
  "extends": [
    "@pacote/eslint-config-jest",
    "plugin:testing-library/dom",
    "plugin:testing-library/react"
  ]
}
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
