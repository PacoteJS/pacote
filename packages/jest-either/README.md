# @pacote/jest-either

![version](https://badgen.net/npm/v/@pacote/jest-either)
![minified](https://badgen.net/bundlephobia/min/@pacote/jest-either)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/jest-either)

Additional matchers for [Jest](https://jestjs.io) making it easier to test `Either` objects.

## Installation

```bash
yarn add @pacote/jest-either
```

## Usage

```typescript
import matchers from '@pacote/jest-either'

expect.extend(matchers)
```

### `.toBeEither()`

```typescript
import { left, right } from 'fp-ts/lib/Either'

test('passes when value is an Either', () => {
  expect(left(true)).toBeEither()
  expect(right(true)).toBeEither()
})

test('passes when value is not an Either', () => {
  expect(undefined).not.toBeEither()
})
```

### `.toBeRight()`

```typescript
import { left, right } from 'fp-ts/lib/Either'

test('passes when Either is a right', () => {
  const actual = right({ test: 'ok' })
  expect(actual).toBeRight()
})

test('passes when Either is a left', () => {
  const actual = left(Error())
  expect(actual).not.toBeRight()
})
```

### `.toBeLeft()`

```typescript
import { left, right } from 'fp-ts/lib/Either'

test('passes when Either is a left', () => {
  const actual = left(Error())
  expect(actual).toBeLeft()
})

test('passes when Either is a right', () => {
  const actual = right({ test: 'ok' })
  expect(actual).not.toBeLeft()
})
```

### `.toEqualRight(value)`

```typescript
import { right } from 'fp-ts/lib/Either'

test('passes when right of Either equals a value', () => {
  const actual = right({ test: 'ok' })
  expect(actual).toEqualRight({ test: 'ok' })
})

test('passes when right of Either does not equal a value', () => {
  const actual = right({ test: 'unexpected' })
  expect(actual).not.toEqualRight({ test: 'ok' })
})
```

### `.toEqualLeft(value)`

```typescript
import { left } from 'fp-ts/lib/Either'

test('passes when left of Either equals a value', () => {
  const actual = left(Error('message'))
  expect(actual).toEqualLeft(Error('message'))
})

test('passes when left of Either does not equal a value', () => {
  const actual = left(Error('unexpected'))
  expect(actual).not.toEqualLeft(Error('message'))
})
```

### `.toMatchRight(object)`

```typescript
import { right } from 'fp-ts/lib/Either'

test('passes when right of Either matches an object', () => {
  const actual = right({ test: 'ok', foo: 'bar' })
  expect(actual).toMatchRight({ test: 'ok' })
})

test('passes when right of Either does not match an object', () => {
  const actual = right({ test: 'unexpected', foo: 'bar' })
  expect(actual).not.toMatchRight({ test: 'ok' })
})
```

### `.toMatchLeft(object)`

```typescript
import { left } from 'fp-ts/lib/Either'

test('passes when left of Either matches an object', () => {
  const actual = left({ test: 'ok', foo: 'bar' })
  expect(actual).toMatchLeft({ test: 'ok' })
})

test('passes when left of Either does not match an object', () => {
  const actual = left({ test: 'unexpected', foo: 'bar' })
  expect(actual).not.toMatchLeft({ test: 'ok' })
})
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
