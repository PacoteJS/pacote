# @pacote/result

![version](https://badgen.net/npm/v/@pacote/result)
![minified](https://badgen.net/bundlephobia/min/@pacote/result)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/result)

[Result](https://doc.rust-lang.org/std/result/enum.Result.html) type inspired by Rust. It represents either a success (`Ok`) or an error (`Err`).

## Installation

```bash
yarn add @pacote/result
```

## Example

```typescript
import { Ok, Err, map } from '@pacote/result'

function divide(numerator: number, denominator: number): Option<number> {
  return denominator === 0 : Err('division by zero') ? Ok(numerator / denominator)
}

map(n => n + 1, divide(4, 2)) // => Ok(3)
map(n => n + 1, divide(4, 0)) // => Err('division by zero')
```

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
