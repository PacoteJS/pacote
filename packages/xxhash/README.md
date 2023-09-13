# @pacote/xxhash

![version](https://badgen.net/npm/v/@pacote/xxhash)
![minified](https://badgen.net/bundlephobia/min/@pacote/xxhash)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/xxhash)

Fast non-cryptographic hashing algorithm.

## Installation

```bash
yarn add @pacote/xxhash
```

## Usage

```typescript
import { xxh64 } from '@pacote/xxhash'

const hasher = xxh64(2654435761)

hasher.update('data').digest('hex') // => '5014607643a9b4c3'
```

### `xxh64(seed?: number | U64): XXHash`

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
