# @pacote/error

![version](https://badgen.net/npm/v/@pacote/error)
![minified](https://badgen.net/bundlephobia/min/@pacote/error)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/error)

Custom error classes and utilities.

## Installation

```bash
yarn add @pacote/error
```

## Compatibility

`BaseError` is an error class which provides a convenience static `imprint()` method to get around [issues with extending the built-in JavaScript `Error` class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error). It's by no means a bullet-proof solution and full support is not available in older browsers (such as Internet Explorer up to version 10).

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
