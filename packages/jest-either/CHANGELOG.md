# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.9](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.8...@pacote/jest-either@4.0.9) (2021-02-05)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.8](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.7...@pacote/jest-either@4.0.8) (2020-11-27)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.7](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.6...@pacote/jest-either@4.0.7) (2020-11-14)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.6](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.5...@pacote/jest-either@4.0.6) (2020-10-26)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.5](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.4...@pacote/jest-either@4.0.5) (2020-09-05)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.4](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.3...@pacote/jest-either@4.0.4) (2020-07-17)

### Bug Fixes

- 🐛 fixes toBeEither check ([813bda1](https://github.com/PacoteJS/pacote/commit/813bda1956a704df2c0e8bba890fa9fb618f62c1))

## [4.0.3](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.2...@pacote/jest-either@4.0.3) (2020-07-07)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.2](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.1...@pacote/jest-either@4.0.2) (2020-06-03)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.1](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@4.0.0...@pacote/jest-either@4.0.1) (2020-05-21)

**Note:** Version bump only for package @pacote/jest-either

## [4.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@4.0.0) (2020-05-07)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@3.1.0...@pacote/jest-either@4.0.0)

- **Possibly breaking change:** Upgrades `jest-diff` and `jest-matcher-utils`.

## [3.1.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@3.1.0) (2019-08-09)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@3.0.3...@pacote/jest-either@3.1.0)

- Introduces ES module support.

## [3.0.3](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@3.0.3) (2019-07-25)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@3.0.2...@pacote/jest-either@3.0.3)

- Chore: Stop TypeScript configuration and build files from being published.

## [3.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@3.0.0) (2019-07-01)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@2.1.0...@pacote/jest-either@3.0.0)

- **Breaking change:** This version now targets `fp-ts` 2.0.0 or more recent.
- **Breaking change:** This library now requires `fp-ts` to be installed as a peer dependency.

## [2.1.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.1.0) (2019-02-12)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@2.0.1...@pacote/jest-either@2.1.0)

- Support for asymmetric matchers in `.toEqualLeft()` and `.toEqualRight()`.

## [2.0.1](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.0.1) (2019-02-07)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@2.0.0...@pacote/jest-either@2.0.1)

- Fixes missing `@pacote/is-plain-object` dependency.

## [2.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@2.0.0) (2019-02-07)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/jest-either@1.0.0...@pacote/jest-either@2.0.0)

- **Breaking change:** Alters `.toMatchLeft()` and `.toMatchRight()` to partially match nested objects, consistent with Jest's `toMatchObject()`. This is a breaking change if you were relying on these methods with partial matches to verify deeply nested objects.
- Use regular expressions to match string values with `.toMatchLeft()` and `.toMatchRight()`.
- Adds `.toBeEither()` matcher.
- Output diffs when using `.toEqualLeft()` and `.toEqualRight()` matches.
- Fixes highlight colour for expected value output when using the `.toEqualLeft()` and `.toEqualRight()` matchers.

## [1.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/jest-either@1.0.0) (2019-02-06)

- Initial release.
