# @pacote/bloom-filter

![version](https://badgen.net/npm/v/@pacote/bloom-filter)
![minified](https://badgen.net/bundlephobia/min/@pacote/bloom-filter)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/bloom-filter)

A bloom filter is a space-efficient probabilistic data structure that allows
testing whether an element belongs to a set.

## Installation

```bash
yarn add @pacote/bloom-filter
```

## Usage

```typescript
import { BloomFilter } from '@pacote/bloom-filter'

const filter = new BloomFilter({ size: 10000, hashes: 20 })

filter.add('foo')
filter.add('bar')

filter.has('foo') // -> true
filter.has('bar') // -> true
filter.has('baz') // -> false
```

### `BloomFilter<T extends { toString(): string }>`

`BloomFilter` allows building a filter which may be used to test the membership
of any `String`-serialisable value (i.e. an object which implements the
`toString()` method).

Class instances may be serialised into JSON using `JSON.stringify()` for storage
or for sending over the network. The JSON string can then be deserialised and
fed back into the constructor to recreate the original bloom filter.

This class depends on [`xxhashjs`](https://www.npmjs.com/package/xxhashjs) for
an implementation of the [fast XXH32 non-cryptographic hashing algorithm](https://cyan4973.github.io/xxHash/)
to build and search the filter.

#### Options

The class constructor takes an options object with the following properties:

- `size` (required) determines the size of the filter in bits. The value is
  required and must not be negative.

- `hashes` (required) sets the number of distinct hashes that need to be
  calculated. A higher number performs more slowly, but lowers the probability
  of false positives occuring. The value is required and must be a positive
  integer.

- `seed` sets the seed for the hashing function. The default is `0x00c0ffee`.

- `filter` allows initialising the filter from an array of unsigned 32-bit
  integers.

#### `add(element: T)`

The `add()` method mutates to filter to indicate that the provided serialisable
element is present.

#### `has(element: T)`

The `has()` method checks the filter for membership of the provided value.

#### `BloomFilter.optimal(length: number, errorRate: number): Options`

`optimal()` is a static method to calculate the optimal bloom filter `size` and
`hashes` options based on the number of items in the filter (_n_) and the
desired false positive error rate (_&epsilon;_).

The size of the filter, or _m_, is calculated with:

{\displaystyle m=-{\frac {n\ln \varepsilon }{(\ln 2)^{2}}}}

The number of hashes, or _k_, is determined by the formula:

{\displaystyle k={\frac {m}{n}}\ln 2}

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
