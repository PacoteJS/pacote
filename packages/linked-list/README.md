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

### `head<T>(list: LinkedList<T>): Option<T>`

`head()` returns an `Option` with the first element of the linked list, or
`None` if the linked list is empty.

### `tail<T>(list: LinkedList<T>): Option<T>`

`tail()` returns an `Option` with the final element in the linked list. If the
linked list is empty, it returns `None`.

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
the linked list is empty or has a single element, it returns an empty list.

### `filter<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): LinkedList<T>`

`filter()` iterates over all items in the provided list and evaluates the
`predicate` function for each one, returning a new list containing only the items
for which the `predicate` function yielded `true`.

### `map<T, R>(mapper: (element: T, index: number, collection: LinkedList<T>) => R, list: LinkedList<T>): LinkedList<R>`

`map()` iterates over all items in the provided list and evaluates each element
through the `mapper` function, returning a new list containing the resulting
values.

### `reduce<T, R>(reducer: (accumulator: R, element: T, index: number, collection: LinkedList<T>) => R, initial: R, list: LinkedList<T>): R`

`reduce()` executes the provided `reducer` function on each element of the list,
resulting in a single output value, which gets successively passed to the
`reducer` function in the next execution.

The first time the `reducer` function is executed, it receives the `initial`
value.

The result of the last execution of the `reducer` function is returned by
`reduce()`.

### `reduceRight<T, R>(reducer: (accumulator: R, element: T, index: number, collection: LinkedList<T>) => R, initial: R, list: LinkedList<T>): R`

`reduceRight()` works like `reduce()`, but the list is iterated starting at the
tail.

### `find<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): Option<T>`

`find()` returns an `Option` with the first element in the list that satisfies
the provided `predicate` function. If the element cannot be found, it returns
`None`.

### `findIndex<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): Option<number>`

`findIndex()` returns an `Option` with index of first element in the list that
satisfies the provided `predicate` function. If the element cannot be found, it
returns `None`.

### `entries<T>(list: LinkedList<T>): IterableIterator<[number, T]>`

`entries()` returns a new [iterator object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
that contains the key/value pairs for each index in the list.

### `keys<T>(list: LinkedList<T>): IterableIterator<number>`

`keys()` returns a new [iterator object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
that contains the values for each index in the list.

### `values<T>(list: LinkedList<T>): IterableIterator<T>`

`values()` returns a new [iterator object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
that contains the values of each element in the list.

### `indexOf<T>(element: T, list: LinkedList<T>): Option<number>`

`indexOf()` returns an `Option` with the first index at which a given element
can be found in the list, or `None` if it is not present.

### `lastIndexOf<T>(element: T, list: LinkedList<T>): Option<number>`

`lastIndexOf()` returns an `Option` with the first index at which a given
element can be found in the list, or `None` if it is not present. The list is
searched backwards.

### `get<T>(index: number, list: LinkedList<T>): Option<T>`

`get()` returns an `Option` with the element at the provided `index`, or `None`
if the `index` is out of bounds.

### `remove<T>(index: number, list: LinkedList<T>): LinkedList<T>`

`remove()` returns a new linked list with the element at `index` removed.

### `slice<T>(start: number, end?: number, list: LinkedList<T>): LinkedList<T>`

`slice()` returns a new linked list with a subset of elements between indices
`start` (inclusive) and `end` (non-inclusive). If `end` is omitted, the function
returns a slice between `start` and the end of the list.

### `every<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): boolean`

`every()` returns `true` is all the elements in the list satisfy the provided
`predicate` function, otherwise it returns `false`.

### `some<T>(predicate: (element: T, index: number, collection: LinkedList<T>) => boolean, list: LinkedList<T>): boolean`

`some()` returns `true` is at least one element in the list satisfies the
provided `predicate` function, otherwise it returns `false`.

### `includes<T>(element: T, list: LinkedList<T>): boolean`

`includes()` returns `true` is the provided `element` exists in the list,
otherwise it returns false.

### `sort<T>(comparator?: (a: T, b: T) => number, list: LinkedList<T>): LinkedList<T>`

`sort()` returns a new list with the elements in the provided `list` in order.
The default sort order is ascending, built upon converting the elements into
strings, but can be overriden with a custom `comparator` function.

The function implements the merge sort algorithm, with _O(n log n)_ time
complexity and _O(n)_ space complexity.

`sort()` attempts to replicate the specified behaviour of the
[`Array.prototype.sort()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
method (although bear in mind that `Array.prototype.sort()` is not stable in
every environment).

## See also

- [`@pacote/option`](../option/README.md)

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
