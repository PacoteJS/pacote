# @pacote/bloom-filter

![version](https://badgen.net/npm/v/@pacote/bloom-filter)
![minified](https://badgen.net/bundlephobia/min/@pacote/bloom-filter)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/bloom-filter)

A Bloom filter is a space-efficient probabilistic data structure that allows
testing whether an element belongs to a set.

Bloom filters relax result accuracy for this efficiency. With Bloom filters,
false positive matches are possible, but false negatives are not. That is to
say, while it can tell you with certainty when an element is not in a set, any
positive responses indicate only a possibility.

This false positive error rate can be lowered — but never completely eliminated
— by increasing the size of the filter and/or the number of hashes computed for
each element.

## Installation

```bash
yarn add @pacote/bloom-filter
```

## Sizing formulas

The `optimal()` helper function calculates the optimal Bloom filter `size` and
`hashes` options based on the number of items in the filter (_n_) and the
desired false positive error rate (_ε_).

The size of the filter, or _m_, is calculated with:

![](docs/optimal-size.svg)

The number of hashes, or _k_, is determined by the formula:

![](docs/optimal-hashes.svg)

## Hashing algorithms

This class depends on [`xxhashjs`](https://www.npmjs.com/package/xxhashjs) for
an implementation of the [fast XXH64 non-cryptographic hashing algorithm](https://cyan4973.github.io/xxHash/)
to build and search the filter via enhanced double hashing.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
