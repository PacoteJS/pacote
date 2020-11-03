# @pacote/get-style

![version](https://badgen.net/npm/v/@pacote/get-style)
![minified](https://badgen.net/bundlephobia/min/@pacote/get-style)
![minified + gzip](https://badgen.net/bundlephobia/minzip/@pacote/get-style)

Get an element's computed style for the provided CSS property.

## Installation

```bash
yarn add @pacote/get-style
```

## Usage

```typescript
import { getStyle } from '@pacote/get-style'

// When the body element has `font-size: 20px`.
getStyle(document.body, 'fontSize') // => '20px'
```

### `getStyle(element: HTMLElement, property: string): string`

`getStyle()` takes an element and the CSS property to fetch and returns its
computed value.

## License

MIT © [Luís Rodrigues](https://goblindegook.com).
