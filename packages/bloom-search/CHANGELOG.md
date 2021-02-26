# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.4](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.3...@pacote/bloom-search@0.6.4) (2021-02-26)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.3](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.2...@pacote/bloom-search@0.6.3) (2021-02-14)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.1...@pacote/bloom-search@0.6.2) (2021-02-14)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.0...@pacote/bloom-search@0.6.1) (2021-02-14)

**Note:** Version bump only for package @pacote/bloom-search

# [0.6.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.5.2...@pacote/bloom-search@0.6.0) (2021-02-05)

### Features

- 🎸 n-gram indexing and phrase search (in quotes) ([505e87d](https://github.com/PacoteJS/pacote/commit/505e87dc3f482e3b9db6bec3f698cd6823228e9a))

## [0.5.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.5.1...@pacote/bloom-search@0.5.2) (2021-02-05)

**Note:** Version bump only for package @pacote/bloom-search

## [0.5.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.5.0...@pacote/bloom-search@0.5.1) (2021-02-02)

### Bug Fixes

- 🐛 properly intersect required term search results ([12458c6](https://github.com/PacoteJS/pacote/commit/12458c6673c57ac549e0cce56d46581a2965c1b4))

# [0.5.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.4.0...@pacote/bloom-search@0.5.0) (2021-02-01)

### Features

- 🎸 support the `+required` operator in search ([c4f7c06](https://github.com/PacoteJS/pacote/commit/c4f7c06593eac2c9947f1d6ba9c1a0c60eb88591))

# [0.4.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.3.1...@pacote/bloom-search@0.4.0) (2021-01-25)

### Features

- 🎸 supports replacing and removing indexed documents ([5411b94](https://github.com/PacoteJS/pacote/commit/5411b948c004866b0f4dc5400d8410c972bcc120))

### BREAKING CHANGES

- 🧨 The `add()` method now requires a string reference identifier.

## [0.3.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.3.0...@pacote/bloom-search@0.3.1) (2021-01-25)

### Bug Fixes

- 🐛 export ES2019 to prevent common errors with Webpack ([fa8ce59](https://github.com/PacoteJS/pacote/commit/fa8ce59f925e1c888f9727291612490b30dd5842))
- 🐛 prevent error iterating undefined token array ([905a020](https://github.com/PacoteJS/pacote/commit/905a0201cba1d73246692ff18ffcc9f65542a0f6))

# [0.3.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.2.0...@pacote/bloom-search@0.3.0) (2021-01-25)

### Features

- 🎸 make errorRate default to 0.0001 ([5f17323](https://github.com/PacoteJS/pacote/commit/5f17323d7da4661be58426072f0f628292e1b77b))

# [0.2.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.1.0...@pacote/bloom-search@0.2.0) (2021-01-24)

### Features

- 🎸 `load()` method to rehydrate serialised indices ([38a6e4f](https://github.com/PacoteJS/pacote/commit/38a6e4fcedd06e6d27888c857fd27df532f40475))

### BREAKING CHANGES

- 🧨 index is no longer received by the constructor

# 0.1.0 (2021-01-24)

### Bug Fixes

- 🐛 package dependency references in tsconfig ([d7ee024](https://github.com/PacoteJS/pacote/commit/d7ee024f28d0bb5f6a6d97ca8907a5e0c26df839))

### Features

- 🎸 allow indexing partial documents ([3ac0f1d](https://github.com/PacoteJS/pacote/commit/3ac0f1d060d65adca8d02d3eabc8ac9d85f650b5))
- 🎸 bloom-search: simple document search with Bloom filters ([569c4c3](https://github.com/PacoteJS/pacote/commit/569c4c3d8417b7df73bb8e7f1b13dc8792e2ba9c))
- 🎸 improve typings ([be6d33f](https://github.com/PacoteJS/pacote/commit/be6d33fea728792e242385bdf2764a6498dce594))
- 🎸 make summary fields mandatory ([4d9fbcf](https://github.com/PacoteJS/pacote/commit/4d9fbcf9e207b8c699c93e47cb3e833622c3de08))
- 🎸 type inference improvements ([688935d](https://github.com/PacoteJS/pacote/commit/688935d6e32b3f0740beeffe2f5c197fc3433baf))
