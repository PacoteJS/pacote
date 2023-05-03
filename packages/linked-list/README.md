# @pacote/linked-list

![version](https://badgen.net/npm/v/@pacote/linked-list)
![minified](https://badgen.net/bundlephobia/min/@pacote/linked-list)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/linked-list)

Immutable linked lists.

## Installation

```bash
yarn add @pacote/linked-list
```

## Example

```typescript
import { listOf, sort } from '@pacote/linked-list'

sort(listOf(3, 2, 1)) // => [1, [2, [3, undefined]]]
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
