# @pacote/shuffle

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/shuffle)
![minified](https://badgen.net/bundlephobia/min/@pacote/shuffle)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/shuffle)

An implementation of the Fisher–Yates algorithm for shuffling collections.

## Installation

```bash
yarn add @pacote/shuffle
```

## Usage

```typescript
import { shuffle } from '@pacote/shuffle'

shuffle([1, 2, 3])
```

### `shuffle<T>(items: T[]): T[]`

`shuffle()` takes an item sequence and returns a randomly permutated sequence
of its elements.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
