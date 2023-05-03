# @pacote/linked-list

![version](https://badgen.net/npm/v/@pacote/linked-list)
![minified](https://badgen.net/bundlephobia/min/@pacote/linked-list)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/linked-list)

Immutable linked lists.

## Installation

```bash
yarn add @pacote/linked-list
```

## Usage

```typescript
import { listOf, sort } from '@pacote/linked-list'

sort(listOf(3, 2, 1)) // => [1, [2, [3, undefined]]]
```

### Basic functions

#### `listOf<T>(...args: T[]): LinkedList<T>`

`listOf()` creates a new singly linked list with the arguments passed as items.

#### `isEmpty<T>(list: LinkedList<T>): boolean`

`isEmpty()` returns `true` if the provided linked list is empty, `false`
otherwise.

#### `length<T>(list: LinkedList<T>): number`

`length()` takes a linked list and returns the number of elements it contains.

#### `head<T>(list: LinkedList<T>): Option<T>`

`head()` returns an `Option` with the first element of the linked list, or
`None` if the linked list is empty.

#### `tail<T>(list: LinkedList<T>): Option<T>`

`tail()` returns an `Option` with the final element in the linked list. If the
linked list is empty, it returns `None`.

#### `append<T>(element: T, list: LinkedList<T>): LinkedList<T>`

`append()` adds a new element at the tail of the linked list.

#### `concat<T>(before: LinkedList<T>, after: LinkedList<T>): LinkedList<T>`

`concat()` combines two linked lists.

### Conversion functions

#### `toArray<T>(list: LinkedList<T>): T[]`

`toArray()` turns a linked list into its equivalent array representation.

### Folding functions

#### `reduce<T, R>(callback: (accumulator: R, element: T, index: number, collection: LinkedList<T>) => R, initial: R, list: LinkedList<T>): R`

`reduce()` executes the provided `callback` function on each element of
the list, resulting in a single output value, which gets successively
passed to the `callback` function in the next execution.

The first time the `callback` function is executed, it receives the
`initial` value.

The result of the last execution of the `callback` function is returned
by `reduce()`.

#### `reduceRight<T, R>(callback: (accumulator: R, element: T, index: number, collection: LinkedList<T>) => R, initial: R, list: LinkedList<T>): R`

`reduceRight()` works like `reduce()`, but the list is iterated starting
at the tail.

### Searching functions

#### `findIndex<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): Option<number>`

`findIndex()` returns an `Option` with index of first element in the
list that satisfies the provided `predicate` function. If the element
cannot be found, it returns `None`.

#### `indexOf<T>(element: T, list: LinkedList<T>): Option<number>`

`indexOf()` returns an `Option` with the first index at which a given element
can be found in the list, or `None` if it is not present.

#### `lastIndexOf<T>(element: T, list: LinkedList<T>): Option<number>`

`lastIndexOf()` returns an `Option` with the first index at which a given
element can be found in the list, or `None` if it is not present. The list is
searched backwards.

## See also

- [`@pacote/option`](../option/)

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
