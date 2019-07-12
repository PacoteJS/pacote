# @pacote/computus

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/computus)
![minified](https://badgen.net/bundlephobia/min/@pacote/computus)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/computus)

Determine the calendar date of the Easter holiday.

## Installation

```bash
yarn add @pacote/computus
```

## Usage

```typescript
import { gregorian } from '@pacote/computus'

gregorian(2020) // .toLocaleDateString() => '4/12/2020'
```

### `gregorian(year: number): Date`

The function takes a year and returns a `Date` object with the Gregorian
calendar Easter day on that year at midnight.

This function uses a version of the Meeus/Jones/Butcher algorithm published by
_New Scientist_ on 30 March 1961.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
