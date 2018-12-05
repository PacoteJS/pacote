# @pacote/immutable

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/immutable)
![minified](https://badgen.net/bundlephobia/min/@pacote/immutable)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/immutable)

Generic type for deeply immutable data.

## Installation

```bash
yarn add @pacote/immutable
```

## Usage

```typescript
import { Immutable } from '@pacote/immutable'

type Foo = { foo: string }

const mutable: Foo[] = [{ foo: 'bar' }]

// Allowed:
mutable.push({ foo: 'baz' })
mutable[0].foo = 'baz'
delete mutable[0].foo

const immutable: Immutable<Foo[]> = [{ foo: 'bar' }]

// Not allowed:
immutable.push({ foo: 'baz' })
immutable[0].foo = 'baz'
delete immutable[0].foo
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
