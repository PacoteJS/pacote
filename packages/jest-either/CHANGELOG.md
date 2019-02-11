# Change Log

## [v2.1.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.1.0) (2019-02-11)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@2.0.1...@pacote/jest-either@2.1.0)

- Support for asymmetric matchers in `.toEqualLeft()` and `.toEqualRight()`.

## [v2.0.1](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.0.1) (2019-02-07)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@2.0.0...@pacote/jest-either@2.0.1)

- Fixes missing `@pacote/is-plain-object` dependency.

## [v2.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.0.0) (2019-02-07)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@1.0.0...@pacote/jest-either@2.0.0)

- **Breaking change:** Alters `.toMatchLeft()` and `.toMatchRight()` to partially match nested objects, consistent with Jest's `toMatchObject()`. This is a breaking change if you were relying on these methods with partial matches to verify deeply nested objects.
- Use regular expressions to match string values with `.toMatchLeft()` and `.toMatchRight()`.
- Adds `.toBeEither()` matcher.
- Output diffs when using `.toEqualLeft()` and `.toEqualRight()` matches.
- Fixes highlight colour for expected value output when using the `.toEqualLeft()` and `.toEqualRight()` matchers.

## [v1.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@1.0.0) (2019-02-06)

- Initial release.
