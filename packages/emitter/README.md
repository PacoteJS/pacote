# @pacote/emitter

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
![version](https://badgen.net/npm/v/@pacote/emitter)
![minified](https://badgen.net/bundlephobia/min/@pacote/emitter)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/emitter)

Minimalistic event emitter.

## Installation

```bash
yarn add @pacote/emitter
```

## Usage

```typescript
import { createEmitter } from '@pacote/emitter'

const emitter = createEmitter()

emitter.on('greet', () => console.log('Hello, world!'))
emitter.emit('greet') // => 'Hello, world!'
```

### `createEmitter<Events>(): Emitter<Events>`

`createEmitter()` creates a new instance of an event emitter that provides the following methods:

#### `.on(name: string, fn: (...args: any[]): void): () => void`

Binds the `fn` callback to an event with the supplied name.

The method returns a function that unbinds the callback, preventing it from being called again.

```typescript
const emitter = createEmitter()

const unbind = emitter.on('greet', () => console.log('Hello, world!'))

emitter.emit('greet') // triggers the callback

unbind()

emitter.emit('greet') // no longer triggers the callback
```

#### `.emit(name: string, ...args: any[]): void`

Fires the named event, triggering any subscribers previously bound to it using the `.on()` method. Arguments provided after the name are passed to the callback function.

```typescript
const emitter = createEmitter()

emitter.on('greet', name => console.log(`Hello, ${name}!`))

emitter.emit('greet', 'TypeScript') // => 'Hello, TypeScript!'
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
