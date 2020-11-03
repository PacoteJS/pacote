# @pacote/computus

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
import { gregorian, julian } from '@pacote/computus'

gregorian(2020) // .toLocaleDateString() => '4/12/2020'
julian(2020) // .toLocaleDateString() => '4/19/2020'
```

### `gregorian(year: number): Date`

This function takes a year and returns a `Date` object with the Gregorian
calendar Easter day on that year at midnight.

The function uses a version of the Meeus/Jones/Butcher algorithm published by
_New Scientist_ on 30 March 1961.

### `julian(year: number): Date`

This function takes a year and returns a `Date` object with the Eastern Orthodox
Easter day on that year at midnight. Please note that this date is returned for
the Gregorian calendar, 13 days (as of 1900 through 2099) after the Julian date.

The function implements the Jean Meeus algorithm from his book _Astronomical
Algorithms_ (1991).

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
