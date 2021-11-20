# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.5](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@6.0.4...@pacote/ffetch@6.0.5) (2021-11-20)

**Note:** Version bump only for package @pacote/ffetch





## [6.0.4](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@6.0.3...@pacote/ffetch@6.0.4) (2021-08-13)


### Bug Fixes

* 🐛 update fp-ts pipe import location ([089ace9](https://github.com/PacoteJS/pacote/commit/089ace98405b962debf594d4a2678b21a32e17b3))





## [6.0.3](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@6.0.2...@pacote/ffetch@6.0.3) (2020-11-27)

**Note:** Version bump only for package @pacote/ffetch

## [6.0.2](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@6.0.1...@pacote/ffetch@6.0.2) (2020-11-14)

**Note:** Version bump only for package @pacote/ffetch

## [6.0.1](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@6.0.0...@pacote/ffetch@6.0.1) (2020-09-05)

**Note:** Version bump only for package @pacote/ffetch

# [6.0.0](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@5.1.4...@pacote/ffetch@6.0.0) (2020-06-04)

### Bug Fixes

- 🐛 proper error type widening on failure response parsing ([db02ef3](https://github.com/PacoteJS/pacote/commit/db02ef3c30635d0c600b0203f6729a0908e588e8))

### BREAKING CHANGES

- 🧨 requires fp-ts 2.6.0 or newer

## [5.1.4](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@5.1.3...@pacote/ffetch@5.1.4) (2020-06-03)

**Note:** Version bump only for package @pacote/ffetch

## [5.1.3](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@5.1.2...@pacote/ffetch@5.1.3) (2020-05-21)

**Note:** Version bump only for package @pacote/ffetch

## [5.1.0](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@5.1.0) (2019-08-08)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@5.0.3...@pacote/ffetch@5.1.0)

- Introduces ES module support.

## [5.0.3](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@5.0.3) (2019-07-25)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@5.0.2...@pacote/ffetch@5.0.3)

- Stop TypeScript configuration and build files from being published.

## [5.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@5.0.0) (2019-07-01)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@4.0.0...@pacote/ffetch@5.0.0)

- **Breaking change:** This library now requires `fp-ts` to be installed as a peer dependency.

## [4.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@4.0.0) (2019-07-01)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@3.0.4...@pacote/ffetch@4.0.0)

- **Breaking change:** Due to the way `fp-ts` 2.0.0 operates, `await ffetch(...).run()` is now executed using `await ffetch(...)()`.

## [3.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@3.0.0) (2018-11-08)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/@pacote/ffetch@2.0.0...@pacote/ffetch@3.0.0)

- **Breaking change:** Changes to structure and type of thrown errors.

## [2.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@2.0.0) (2018-10-04)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/v1.1.1...@pacote/ffetch@2.0.0)

- **Breaking change:** `ffetch` no longer relies on `isomorphic-fetch`, and instead uses the global `fetch` function, if available. Developers should set a global polyfill or build a custom `ffetch` function passing any Fetch API compatible function in the options.

## [1.1.0](https://github.com/goblindegook/ffetch/tree/v1.1.0) (2018-10-02)

[Full Changelog](https://github.com/goblindegook/ffetch/compare/v1.0.1...v1.1.0)

- Factory function to allow custom response parsers.

## [1.0.1](https://github.com/goblindegook/ffetch/tree/v1.0.1) (2018-09-22)

[Full Changelog](https://github.com/goblindegook/ffetch/compare/v1.0.0...v1.0.1)

- Improves `Content-Type: application/json` matching.

## [1.0.0](https://github.com/goblindegook/ffetch/tree/v1.0.0) (2018-09-21)

- Initial release.
