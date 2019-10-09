# @pacote/interpolate

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/interpolate)
![minified](https://badgen.net/bundlephobia/min/@pacote/interpolate)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/interpolate)

Super simple microtemplating.

## Installation

```bash
yarn add @pacote/interpolate
```

## Usage

```typescript
import { interpolate } from '@pacote/interpolate'

const render = interpolate('Hello, {{ name }}!')

render({ name: 'world' }) // => Hello, world!
```

### `interpolate(template: string, pattern?: RegExp) => (data?: {}) => string`

`interpolate()` takes a string template and returns a function that accepts an object containing the strings to replace.

Please note that all the function does is substitute placeholders, it does not handle loops, conditionals or perform character escaping.

`interpolate()` optionally receives a pattern expression in order to customise the delimiters. This pattern _must_ have a single capture group. For example:

```typescript
const render = interpolate('Hello, %{name}!', /%{([\s\S]+?)}/)

render({ name: 'world' }) // => Hello, world!
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
