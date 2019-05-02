# @pacote/pixels

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/pixels)
![minified](https://badgen.net/bundlephobia/min/@pacote/pixels)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/pixels)

Convert CSS length values to pixels.

## Installation

```bash
yarn add @pacote/pixels
```

## Usage

```typescript
import { pixels } from '@pacote/pixels'

// When the root element has `font-size: 16px`.
pixels('2rem') // => 32
```

### `pixels(value: string): number`

`pixels()` takes a CSS string with the value and unit and converts it to pixels.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
