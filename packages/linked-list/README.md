# @pacote/linked-list

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/linked-list)
![minified](https://badgen.net/bundlephobia/min/@pacote/linked-list)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/linked-list)

Immutable linked lists.

## Installation

```bash
yarn add @pacote/linked-list
```

## Usage

```typescript
import { listOf } from '@pacote/linked-list'

listOf() // => [Symbol(Nothing), undefined]
listOf(1, 2, 3) // => [1, [2, [3, undefined]]]
```

### `listOf<T>(...args: T[]): LinkedList<T>`

`listOf()` creates a new singly linked list with the arguments passed as items.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
