# @pacote/ribbon-filter

![version](https://badgen.net/npm/v/@pacote/ribbon-filter)
![minified](https://badgen.net/bundlephobia/min/@pacote/ribbon-filter)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/ribbon-filter)

A Ribbon filter is a space-efficient probabilistic data structure that allows
testing whether an element belongs to a set.

Ribbon filters relax result accuracy for this efficiency. With Ribbon filters,
false positive matches are possible, but false negatives are not. That is to
say, while it can tell you with certainty when an element is not in a set, any
positive responses indicate only a possibility.

Unlike Bloom filters, Ribbon filters are static: they are built once from the
complete set of elements and cannot be changed afterwards. In exchange, they
use less space than a Bloom filter with the same false positive error rate.

This false positive error rate can be lowered — but never completely eliminated
— by increasing the number of fingerprint bits stored for each element.

## Installation

```bash
yarn add @pacote/ribbon-filter
```

## Sizing formulas

The `optimal()` helper function calculates the optimal Ribbon filter
`fingerprintBits` option based on the desired false positive error rate (_ε_).

The number of fingerprint bits, or _r_, is determined by the formula:

_r_ = ⌈log₂(1/_ε_)⌉

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
