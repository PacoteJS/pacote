# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.17.3](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.17.2...@pacote/bloom-search@0.17.3) (2023-08-25)

**Note:** Version bump only for package @pacote/bloom-search





## [0.17.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.17.1...@pacote/bloom-search@0.17.2) (2023-06-20)

### Bug Fixes

- 🐛 compatibility with Node 16 ([0630651](https://github.com/PacoteJS/pacote/commit/0630651bdcaca4516adaf96d9b56e0b02150d5ac))

## [0.17.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.17.0...@pacote/bloom-search@0.17.1) (2023-06-19)

**Note:** Version bump only for package @pacote/bloom-search

# [0.17.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.16.2...@pacote/bloom-search@0.17.0) (2023-06-17)

### Features

- 🎸 minSize option to improve relevance with small document ([075d1c2](https://github.com/PacoteJS/pacote/commit/075d1c2856e136793ab87ece759a7c9fb543f15a))

## [0.16.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.16.1...@pacote/bloom-search@0.16.2) (2023-06-17)

### Bug Fixes

- 🐛 remove console.log ([bfb09c5](https://github.com/PacoteJS/pacote/commit/bfb09c5076ce0477f9a00bc1b77ac240f8e4da9c))

## [0.16.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.16.0...@pacote/bloom-search@0.16.1) (2023-06-17)

### Bug Fixes

- 🐛 use frequency for the bucket key instead of the index ([c8f3a68](https://github.com/PacoteJS/pacote/commit/c8f3a681bc8027f7fd6c8e751bacf368711dbed5))

# [0.16.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.15.3...@pacote/bloom-search@0.16.0) (2023-06-17)

### Features

- 🎸 search index space efficiency by using classic filters ([8c9d8ec](https://github.com/PacoteJS/pacote/commit/8c9d8ecd0e6c89166f695bfe565e51542d3718e0))

### BREAKING CHANGES

- 🧨 Due to the changes, serialised instances are no longer compatible with
  previous versions of Bloom search.

## [0.15.3](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.15.2...@pacote/bloom-search@0.15.3) (2023-06-15)

### Performance Improvements

- ⚡️ hashing memoization ([6a519ac](https://github.com/PacoteJS/pacote/commit/6a519ac95dbb1c5123a059820548201f95e46022))

## [0.15.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.15.1...@pacote/bloom-search@0.15.2) (2023-06-15)

### Bug Fixes

- 🐛 use custom seed, remove slow memoization ([848b508](https://github.com/PacoteJS/pacote/commit/848b508e77b08a4ebc9e24da09a076061eebb15a))

## [0.15.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.15.0...@pacote/bloom-search@0.15.1) (2023-06-15)

**Note:** Version bump only for package @pacote/bloom-search

# [0.15.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@1.0.0-alpha.0...@pacote/bloom-search@0.15.0) (2023-06-15)

### Features

- 🎸 configurable seed for Bloom filters, hashing perf ([447944c](https://github.com/PacoteJS/pacote/commit/447944c66dcddfb0b472ebe31fe823328424f72e))

### Reverts

- Revert "feat: 🎸 Bloom filters accept a hash function" ([e96328b](https://github.com/PacoteJS/pacote/commit/e96328bd0773e565b8176b0ba380c0d13bd649dc))
- Revert "perf: ⚡️ memoize Bloom search hash function" ([ead2cf7](https://github.com/PacoteJS/pacote/commit/ead2cf73a98f2f33b45b76881f7d37a97c03e585))
- Revert "chore(release): publish" ([7f358be](https://github.com/PacoteJS/pacote/commit/7f358be82b8df583c598635d87f169164c3f1d56))

# [0.14.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.13.0...@pacote/bloom-search@0.14.0) (2023-06-15)

### Features

- 🎸 compact signature option to use classic Bloom filters ([17a3bc7](https://github.com/PacoteJS/pacote/commit/17a3bc7ffd66e9cce42a3e135303de8cac10097d))

# [0.13.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.12.0...@pacote/bloom-search@0.13.0) (2023-05-22)

### Features

- 🎸 rank results using tf-idf (count-idf) ([5d87cc5](https://github.com/PacoteJS/pacote/commit/5d87cc52a870185803bcac78d158adbbd9b98993))

# [0.12.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.11.0...@pacote/bloom-search@0.12.0) (2023-05-13)

### Features

- 🎸 default tokenizer now splits words at hyphens ([47f2d5f](https://github.com/PacoteJS/pacote/commit/47f2d5f04efaa302623e7eb74e4e74723d4cd08d))

### BREAKING CHANGES

- 🧨 Changes to the behaviour of the default tokenizer. Plug-in a custom
  tokenizer to replicate the previous behaviour.

# [0.11.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.10.3...@pacote/bloom-search@0.11.0) (2023-05-13)

### Features

- 🎸 allow customising the tokenizer function ([12b398c](https://github.com/PacoteJS/pacote/commit/12b398ca92bdc60d468dbf9e0ae102f2a017a97b))

## [0.10.3](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.10.2...@pacote/bloom-search@0.10.3) (2023-05-11)

**Note:** Version bump only for package @pacote/bloom-search

## [0.10.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.10.1...@pacote/bloom-search@0.10.2) (2023-04-28)

**Note:** Version bump only for package @pacote/bloom-search

## [0.10.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.10.0...@pacote/bloom-search@0.10.1) (2023-04-22)

### Performance Improvements

- ⚡️ iterate documents one time less when searching ([4aa4321](https://github.com/PacoteJS/pacote/commit/4aa43216f260a1df006a5eccf39552589c206d70))

# [0.10.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.9.2...@pacote/bloom-search@0.10.0) (2023-04-13)

### chore

- 🤖 CommonJS packages now build with ES5 compatibility ([c0147ae](https://github.com/PacoteJS/pacote/commit/c0147aeffb81322ea59174a3961b10cfb3bf81e5))

### Features

- 🎸 exclude search results using the - operator ([4ef08d9](https://github.com/PacoteJS/pacote/commit/4ef08d9734228391053f8e10566a40532cf967a4))

### BREAKING CHANGES

- 🧨 CommonJS packages now build with ES5 compatibility as a minimum. ES3 is
  no longer supported.

## [0.9.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.9.1...@pacote/bloom-search@0.9.2) (2023-03-31)

**Note:** Version bump only for package @pacote/bloom-search

## [0.9.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.9.0...@pacote/bloom-search@0.9.1) (2023-03-24)

### Bug Fixes

- 🐛 correct [@pacote](https://github.com/pacote) dependencies ([6e0d9b9](https://github.com/PacoteJS/pacote/commit/6e0d9b92bd30b6a5dacb79173787904d621706d0))

# [0.9.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.8.0...@pacote/bloom-search@0.9.0) (2023-03-24)

### Features

- 🎸 more concise serialisation of Bloom filter arrays ([c456731](https://github.com/PacoteJS/pacote/commit/c45673178b8fee621a2a58844757636d30be17ed))

### BREAKING CHANGES

- 🧨 changes how Bloom filter arrays are serialised with the
  `JSON.stringify()` function

# [0.8.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.7.4...@pacote/bloom-search@0.8.0) (2023-03-24)

### Features

- 🎸 more concise serialisation of Bloom filter arrays ([f23eadb](https://github.com/PacoteJS/pacote/commit/f23eadb9860862e6c51682d357dcbe8f3d6c3d87))

### BREAKING CHANGES

- 🧨 changes how Bloom filter arrays are serialised with the JSON.stringify()
  function

## [0.7.4](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.7.3...@pacote/bloom-search@0.7.4) (2022-12-13)

**Note:** Version bump only for package @pacote/bloom-search

## [0.7.3](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.7.2...@pacote/bloom-search@0.7.3) (2022-09-02)

### Bug Fixes

- 🐛 Fix typing issue ([7b433f5](https://github.com/PacoteJS/pacote/commit/7b433f5a50bc9462f13db945e7a458af76eeadd2))

## [0.7.2](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.7.1...@pacote/bloom-search@0.7.2) (2022-09-02)

**Note:** Version bump only for package @pacote/bloom-search

## [0.7.1](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.7.0...@pacote/bloom-search@0.7.1) (2022-05-19)

### Bug Fixes

- 🐛 drop usage of deprecated substr() method ([5221f1c](https://github.com/PacoteJS/pacote/commit/5221f1c4406cb9e208812edc4ad88bd60b1c5ab5))

# [0.7.0](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.11...@pacote/bloom-search@0.7.0) (2021-11-20)

### Features

- 🎸 pass document to preprocess function ([523cd2b](https://github.com/PacoteJS/pacote/commit/523cd2b38cd93403310c609977e4d56b86abe7b6))

## [0.6.11](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.10...@pacote/bloom-search@0.6.11) (2021-10-23)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.10](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.9...@pacote/bloom-search@0.6.10) (2021-08-13)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.9](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.8...@pacote/bloom-search@0.6.9) (2021-04-26)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.8](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.7...@pacote/bloom-search@0.6.8) (2021-04-23)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.7](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.6...@pacote/bloom-search@0.6.7) (2021-04-15)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.6](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.5...@pacote/bloom-search@0.6.6) (2021-04-06)

**Note:** Version bump only for package @pacote/bloom-search

## [0.6.5](https://github.com/PacoteJS/pacote/compare/@pacote/bloom-search@0.6.4...@pacote/bloom-search@0.6.5) (2021-03-10)

**Note:** Version bump only for package @pacote/bloom-search

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
