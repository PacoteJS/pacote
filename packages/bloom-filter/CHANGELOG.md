# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.5.1...@pacote/bloom-filter@0.5.2) (2023-04-28)

### Performance Improvements

- ⚡️ memoize hashing function ([8499330](https://github.com/PacoteJS/pacote/commit/8499330196a4bb23fee0fe643cd4124a803535b8))

## [0.5.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.5.0...@pacote/bloom-filter@0.5.1) (2023-04-22)

**Note:** Version bump only for package @pacote/bloom-filter

# [0.5.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.4.1...@pacote/bloom-filter@0.5.0) (2023-04-13)

### chore

- 🤖 CommonJS packages now build with ES5 compatibility ([c0147ae](https://github.com/PacoteJS/pacote/commit/c0147aeffb81322ea59174a3961b10cfb3bf81e5))

### BREAKING CHANGES

- 🧨 CommonJS packages now build with ES5 compatibility as a minimum. ES3 is
  no longer supported.

## [0.4.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.4.0...@pacote/bloom-filter@0.4.1) (2023-03-24)

### Bug Fixes

- 🐛 correct [@pacote](https://github.com/pacote) dependencies ([6e0d9b9](https://github.com/PacoteJS/pacote/commit/6e0d9b92bd30b6a5dacb79173787904d621706d0))

# [0.4.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.12...@pacote/bloom-filter@0.4.0) (2023-03-24)

### Features

- 🎸 more concise serialisation of Bloom filter arrays ([f23eadb](https://github.com/PacoteJS/pacote/commit/f23eadb9860862e6c51682d357dcbe8f3d6c3d87))

### BREAKING CHANGES

- 🧨 changes how Bloom filter arrays are serialised with the JSON.stringify()
  function

## [0.3.12](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.11...@pacote/bloom-filter@0.3.12) (2022-09-02)

### Bug Fixes

- 🐛 Fix typing issue ([7b433f5](https://github.com/PacoteJS/pacote/commit/7b433f5a50bc9462f13db945e7a458af76eeadd2))

## [0.3.11](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.10...@pacote/bloom-filter@0.3.11) (2022-09-02)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.10](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.9...@pacote/bloom-filter@0.3.10) (2022-05-19)

### Bug Fixes

- 🐛 drop usage of deprecated substr() method ([5221f1c](https://github.com/PacoteJS/pacote/commit/5221f1c4406cb9e208812edc4ad88bd60b1c5ab5))

## [0.3.9](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.8...@pacote/bloom-filter@0.3.9) (2021-10-23)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.8](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.7...@pacote/bloom-filter@0.3.8) (2021-08-13)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.7](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.6...@pacote/bloom-filter@0.3.7) (2021-03-10)

### Bug Fixes

- 🐛 performance improvement calculating hashes ([79b4e7e](https://github.com/PacoteJS/pacote/commit/79b4e7edd86425442b0a099d0cfeae8af2ac4a07))

## [0.3.6](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.5...@pacote/bloom-filter@0.3.6) (2021-02-26)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.5](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.4...@pacote/bloom-filter@0.3.5) (2021-02-14)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.4](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.3...@pacote/bloom-filter@0.3.4) (2021-02-14)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.3](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.2...@pacote/bloom-filter@0.3.3) (2021-02-14)

**Note:** Version bump only for package @pacote/bloom-filter

## [0.3.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.1...@pacote/bloom-filter@0.3.2) (2021-02-05)

### Bug Fixes

- 🐛 initialise filters from array-like structures ([866cb84](https://github.com/PacoteJS/pacote/commit/866cb84d75f99adab4d775f82dee74083b390007))
- 🐛 revert changes over failing tests ([01ea792](https://github.com/PacoteJS/pacote/commit/01ea7924e9bf69ea98d83f33de65b5d5dd9596df))

## [0.3.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.3.0...@pacote/bloom-filter@0.3.1) (2021-01-25)

### Bug Fixes

- 🐛 export ES2019 to prevent common errors with Webpack ([fa8ce59](https://github.com/PacoteJS/pacote/commit/fa8ce59f925e1c888f9727291612490b30dd5842))

# [0.3.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.2.0...@pacote/bloom-filter@0.3.0) (2021-01-25)

### Features

- 🎸 make errorRate default to 0.0001 ([5f17323](https://github.com/PacoteJS/pacote/commit/5f17323d7da4661be58426072f0f628292e1b77b))

# [0.2.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-filter@0.1.0...@pacote/bloom-filter@0.2.0) (2021-01-24)

### Features

- 🎸 filter size validation ([a2d1f64](https://github.com/PacoteJS/pacote/commit/a2d1f6417cce7349e897adc3b0e89e0875c7bc7b))

# 0.1.0 (2021-01-14)

### Features

- 🎸 bloom filters ([7804c50](https://github.com/PacoteJS/pacote/commit/7804c5091746a5c4de8f3a08d03ce91fe64ad40b))
- 🎸 counting Bloom filter ([59bb371](https://github.com/PacoteJS/pacote/commit/59bb3716486fca1c6ba9c71bd55ff1806421e25c))
- 🎸 use enhanced double hashing ([735501f](https://github.com/PacoteJS/pacote/commit/735501fbdd7cec77a9162a959885124497dafdd7))
