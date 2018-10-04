# Change Log

## [v2.0.0](https://github.com/PacoteJS/pacote/tree/@pacote/ffetch@2.0.0) (2018-10-04)

[Full Changelog](https://github.com/PacoteJS/pacote/compare/v1.1.1...@pacote/ffetch@2.0.0)

- Breaking change: `ffetch` no longer relies on `isomorphic-fetch`, and instead uses the global `fetch` function, if available. Developers should set a global polyfill or build a custom `ffetch` function passing any Fetch API compatible function in the options.

## [v1.1.0](https://github.com/goblindegook/ffetch/tree/v1.1.0) (2018-10-02)

[Full Changelog](https://github.com/goblindegook/ffetch/compare/v1.0.1...v1.1.0)

- Factory function to allow custom response parsers.

## [v1.0.1](https://github.com/goblindegook/ffetch/tree/v1.0.1) (2018-09-22)

[Full Changelog](https://github.com/goblindegook/ffetch/compare/v1.0.0...v1.0.1)

- Improves `Content-Type: application/json` matching.

## [v1.0.0](https://github.com/goblindegook/ffetch/tree/v1.0.0) (2018-09-21)

- Initial release.
