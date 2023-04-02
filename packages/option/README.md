# @pacote/option

![version](https://badgen.net/npm/v/@pacote/option)
![minified](https://badgen.net/bundlephobia/min/@pacote/option)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/option)

[Option](https://doc.rust-lang.org/std/option/enum.Option.html) type inspired by Rust. It represents an optional value, an `Option` is either `Some` concrete value or it is `None`.

## Installation

```bash
yarn add @pacote/option
```

## Usage

```typescript
import { None, Some, map } from '@pacote/option'

function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 : None ? Some(numerator / denominator)
}

map(n => n + 1, divide(4, 2)) // => Some(3)
map(n => n + 1, divide(4, 0)) // => None
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
