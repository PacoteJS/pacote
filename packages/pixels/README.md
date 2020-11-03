# @pacote/pixels

![version](https://badgen.net/npm/v/@pacote/pixels)
![minified](https://badgen.net/bundlephobia/min/@pacote/pixels)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/pixels)

Convert [CSS length values](https://developer.mozilla.org/en-US/docs/Web/CSS/length) to pixels.

## Installation

```bash
yarn add @pacote/pixels
```

## Usage

```typescript
import { pixels } from '@pacote/pixels'

// When the root element has `font-size: 16px`.
pixels('2rem') // => 32
```

### `pixels(value: string): number`

`pixels()` takes a CSS string with the value and unit and converts it to pixels.

Handles common font-relative units (`em`, `rem`, `vw`, `vh`, `vmin`, and `vmax`)
as well as most absolute units (`px`, `cm`, `mm`, `Q`, `in`, `pt`, and `pc`).

The function does not handle percentage lengths as resolution depends on the
relative sizes of specific properties of elements up the DOM tree. For example,
`font-size` is relative to the parent element's `font-size` but `max-height` is
relative to the containing element's `height`.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
