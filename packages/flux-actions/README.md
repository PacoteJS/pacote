# @pacote/flux-actions

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)

Typed [Flux standard actions](https://github.com/redux-utilities/flux-standard-action).

## Installation

```bash
yarn add @pacote/flux-actions
```

## Usage

```typescript
import { createAction, isType } from '@pacote/flux-actions'

const greet = createAction<{ name: string }>('GREET')
const action = greet({ name: 'world' }) as any

if (isType(greet, action)) {
  // action.payload is typed inside guard
  console.log(action.payload.name)
}
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
