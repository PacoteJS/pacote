# @pacote/bloom-filter

![version](https://badgen.net/npm/v/@pacote/bloom-filter)
![minified](https://badgen.net/bundlephobia/min/@pacote/bloom-filter)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/bloom-filter)

A Bloom filter is a space-efficient probabilistic data structure that allows
testing whether an element belongs to a set.

## Installation

```bash
yarn add @pacote/bloom-filter
```

## Usage

```typescript
import { BloomFilter } from '@pacote/bloom-filter'

const filter = new BloomFilter({ size: 22056, hashes: 8 })

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
fed back into the constructor to recreate the original Bloom filter.

The class constructor takes an `Options` object with the following properties:

- `size` (required) determines the size of the filter in bits. The value is
  required and must not be negative.

- `hashes` (required) sets the number of distinct hashes that need to be
  calculated. A higher number performs more slowly, but lowers the probability
  of false positives occuring. The value is required and must be a positive
  integer.

- `seed` sets the seed for the hashing function. The default is `0x00c0ffee`.

- `filter` allows initialising the filter from an array of unsigned 32-bit
  integers.

#### `add(element: T): void`

The `add()` method mutates to filter to indicate that the provided serialisable
element is present.

#### `has(element: T): boolean`

The `has()` method checks the filter for membership of the provided value. If
`false`, it is guaranteed not to be present. Otherwise, there's the possibility
of it being a false positive result.

### `CountingBloomFilter<T extends { toString(): string }>`

`CountingBloomFilter` allows building a filter which may be used to test the
membership of any `String`-serialisable value (i.e. an object which implements
the `toString()` method). It's a generalisation of `BloomFilter` which counts
the number of times an element was added to the set.

Class instances may be serialised into JSON using `JSON.stringify()` for storage
or for sending over the network. The JSON string can then be deserialised and
fed back into the constructor to recreate the original Bloom filter.

The class constructor takes an `Options` object with the following properties:

- `size` (required) determines the number of filter counters. The value is
  required and must not be negative.

- `hashes` (required) sets the number of distinct hashes that need to be
  calculated. A higher number performs more slowly, but lowers the probability
  of false positives occuring. The value is required and must be a positive
  integer.

- `seed` sets the seed for the hashing function. The default is `0x00c0ffee`.

- `filter` allows initialising the filter from an array of unsigned 32-bit
  integers.

#### `add(element: T): void`

The `add()` method mutates to filter and increments its counters to indicate
an instance of the element was added.

#### `remove(element: T): void`

The `remove()` method mutates to filter and decrements its counters to indicate
an instance of the element was removed.

#### `has(element: T): number`

The `has()` method checks the filter for membership of the provided element and
returns the number of times it was added to the filter. If `0`, it is guaranteed
not to be present. Otherwise, there's the possibility of it being a false
positive result.

### `optimal(items: number, errorRate: number): Options`

`optimal()` calculates the optimal Bloom filter `size` and `hashes` options
based on the number of items in the filter (_n_) and the desired false positive
error rate (_&epsilon;_).

The size of the filter, or _m_, is calculated with:

{\displaystyle m=-{\frac {n\ln \varepsilon }{(\ln 2)^{2}}}}

The number of hashes, or _k_, is determined by the formula:

{\displaystyle k={\frac {m}{n}}\ln 2}

## Hashing algorithms

This class depends on [`xxhashjs`](https://www.npmjs.com/package/xxhashjs) for
an implementation of the [fast XXH64 non-cryptographic hashing algorithm](https://cyan4973.github.io/xxHash/)
to build and search the filter via enhanced double hashing.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
