# @pacote/linked-list

[![Build Status](https://travis-ci.org/PacoteJS/pacote.svg?branch=master)](https://travis-ci.org/PacoteJS/pacote)
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

### `listOf<T>(...args: T[]): LinkedList<T>`

`listOf()` creates a new singly linked list with the arguments passed as items.

### `isEmpty<T>(list: LinkedList<T>): boolean`

`isEmpty()` returns `true` if the provided linked list is empty, `false`
otherwise.

### `length<T>(list: LinkedList<T>): number`

`length()` takes a linked list and returns the number of elements it contains.

### `head<T>(list: LinkedList<T>): T | undefined`

`head()` returns the first element of the linked list, or `undefined` if the
linked list is empty.

### `tail<T>(list: LinkedList<T>): LinkedList<T>`

`tail()` returns the final element in the linked list. If the linked list is
empty, it returns `undefined`.

### `toArray<T>(list: LinkedList<T>): T[]`

`toArray()` turns a linked list into its equivalent array representation.

### `prepend<T>(element: T, list: LinkedList<T>): LinkedList<T>`

`prepend()` adds a new element at the head of the linked list.

### `append<T>(element: T, list: LinkedList<T>): LinkedList<T>`

`append()` adds a new element at the tail of the linked list.

### `reverse<T>(list: LinkedList<T>): LinkedList<T>`

`reverse()` inverts the order of the elements in the provided linked list.

### `concat<T>(before: LinkedList<T>, after: LinkedList<T>): LinkedList<T>`

`concat()` combines two linked lists.

### `rest<T>(list: LinkedList<T>): LinkedList<T>`

`rest()` returns all the elements of the linked list beyond the head element. If
the linked list is empty or has a single element, it returns an empty linked
list.

### `filter<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): LinkedList<T>`

`filter()` iterates over all items in the provided list and evaluates the
`predicate` function for each one, returning a new list containing only the items
for which the `predicate` function yielded `true`.

### `map<T, R>(mapper: (element: T, index: number, collection: LinkedList<T>) => R, list: LinkedList<T>): LinkedList<R>`

`map()` iterates over all items in the provided list and evaluates each element
through the `mapper` function, returning a new list containing the resulting
values.

### `reduce<T, R>(reducer: (accumulator: R, element: T, index: number, collection: LinkedList<T>) => R, initial: R, list: LinkedList<T>): R`

...

### `reduceRight<T, R>(reducer: (accumulator: R, element: T, index: number, collection: LinkedList<T>) => R, initial: R, list: LinkedList<T>): R`

...

### `find<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): T | undefined`

...

### `entries<T>(list: LinkedList<T>): IterableIterator<[number, T]>`

...

### `keys<T>(list: LinkedList<T>): IterableIterator<number>`

...

### `values<T>(list: LinkedList<T>): IterableIterator<T>`

...

### `indexOf<T>(element: T, list: LinkedList<T>): number`

...

### `lastIndexOf<T>(element: T, list: LinkedList<T>): number`

...

### `get<T>(index: number, list: LinkedList<T>): T | undefined`

...

### `remove<T>(index: number, list: LinkedList<T>): LinkedList<T>`

...

### `slice<T>(start: number, end?: number, list: LinkedList<T>): LinkedList<T>`

...

### `every<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): boolean`

...

### `some<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): boolean`

...

### `includes<T>(element: T, list: LinkedList<T>): boolean`

...

### `sort<T>(comparator?: (a: T, b: T) => number, list: LinkedList<T>): LinkedList<T>`

...

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
