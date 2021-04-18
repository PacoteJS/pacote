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

### `validation<T, E>(...checks: ((value: T) => Validation<T, E>)[]): (value: T) => Validation<T, E>`

`validation()` composes multiple check functions (which take a value of type `T`
and return a `Validation<T, NonEmptyArray<E>>`) and returns a single function
that executes the check functions in sequence, and accumulates all obtained
errors into a `NonEmptyArray`.

If no check functions fail, the composed validation function returns `Ok` with
the originally passed value.

### `lift<T, E>(check: (value: T) => Result<T, E>): (value: T) => Validation<T, E>`

`lift()` is a combinator which turns a function that returns a `Result<T, E>`
(with a single error) into one that returns a `Validation<T, E>` (with an array
containting one or more errors).

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
