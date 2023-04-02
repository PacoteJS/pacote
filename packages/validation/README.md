# @pacote/validation

![version](https://badgen.net/npm/v/@pacote/validation)
![minified](https://badgen.net/bundlephobia/min/@pacote/validation)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/validation)

The `Validation<T, E>` data type is a `Result` that accumulates multiple
errors.

## Installation

```bash
yarn add @pacote/validation
```

## Usage

```typescript
import { validation, lift } from '@pacote/validation'
import { Ok, Err } from '@pacote/result'

const hasLetter = lift((s: string) =>
  s.match(/[a-z]/i) ? Ok(s) : Err('no letters')
)
const hasDigit = lift((s: string) =>
  s.match(/[0-9]/) ? Ok(s) : Err('no digits')
)

const validate = validation(hasLetter, hasDigit)

validate('-') // => Err(['no letters', 'no digits'])
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
