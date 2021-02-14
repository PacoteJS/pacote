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

`xxh64()` creates a XXHash64 hasher instance with an optional seed. If not
provided, the seed value is 0.

### `XXHash#update(data: string | ArrayBuffer): XXHash`

Updates the hasher state with data from a string or buffer to hash.

The hasher instance is returned for chaining other methods.

### `XXHash#digest(encoding: 'hex'): string`

Outputs the hexadecimal hash of the provided data. The only `encoding` value
allowed at this time is `'hex'`.

### `XXHash#reset(seed?: number | U64): void`

Resets the hasher state with an optional `seed`. If a `seed` is not provided,
then the value remains the one used the last time the hasher was either created
or reset.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
