# Change Log

## [v2.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.0.0) (unreleased)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@1.0.0...@pacote/jest-either@2.0.0)

- **Breaking change:** Alters `.toMatchLeft()` and `.toMatchRight()` to partially match nested objects, consistent with Jest's `toMatchObject()`. This is a breaking change if you were relying on these methods with partial matches to verify deeply nested objects, for the previous version's behaviour, use `expect(...).toEqualRight(expect.objectContaining({ ... }))` instead.

- Adds `.toBeEither()` matcher.

- Output diffs when using `.toEqualLeft()` and `.toEqualRight()` matches.

- Fixes highlight colour for expected value output when using the `.toEqualLeft()` and `.toEqualRight()` matchers.

## [v1.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@1.0.0) (2019-02-06)

- Initial release.
