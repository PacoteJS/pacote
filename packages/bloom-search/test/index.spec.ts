import { BloomSearch } from '../src/index'

test('searching an empty index yields no results', () => {
  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['id'],
  })

  expect(bs.search('foo')).toEqual([])
})

test('searching for words in a field yields matching results', () => {
  const bs = new BloomSearch({
    errorRate: 0.002,
    fields: ['text'],
    summary: ['id'],
  })

  bs.add('1', { id: 1, text: 'foo' })
  bs.add('2', { id: 2, text: 'bar' })

  expect(bs.search('foo')).toEqual([{ id: 1 }])
})

describe('ranking', () => {
  test('searching for words in a field yields matching sorted by number of matches', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['id'],
    })

    bs.add('1', { id: 1, text: 'foo' })
    bs.add('2', { id: 2, text: 'foo-foo' })

    expect(bs.search('foo')).toEqual([{ id: 2 }, { id: 1 }])
  })

  test('ranking is proportional to the term frequency in all documents', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['id'],
    })

    bs.add('1', { id: 1, text: 'a brown fox and a brown dog' })
    bs.add('2', { id: 2, text: 'a brown cow' })

    expect(bs.search('brown cow')).toEqual([{ id: 2 }, { id: 1 }])
  })

  test('document fields can be boosted', () => {
    const bs = new BloomSearch({
      fields: { title: 2, body: 1 },
      summary: ['title'],
    })

    bs.add('1', { title: 'bar', body: 'foo' })
    bs.add('2', { title: 'foo', body: 'bar' })

    expect(bs.search('foo')).toEqual([{ title: 'foo' }, { title: 'bar' }])
  })
})

test('document indices can be replaced', () => {
  const bs = new BloomSearch({
    errorRate: 0.002,
    fields: ['text'],
    summary: ['text'],
  })

  bs.add('ref', { text: 'foo' })
  bs.add('ref', { text: 'bar' })

  expect(bs.search('foo')).toEqual([])
  expect(bs.search('bar')).toEqual([{ text: 'bar' }])
})

test('document indices can be removed', () => {
  const bs = new BloomSearch({
    errorRate: 0.002,
    fields: ['text'],
    summary: ['text'],
  })

  bs.add('1', { text: 'foo bar' })
  bs.remove('1')

  expect(bs.search('foo')).toEqual([])
})

test('search results return only fields in the summary list', () => {
  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
  })

  bs.add('1', { id: 1, text: 'foo' })
  bs.add('2', { id: 2, text: 'bar' })

  expect(bs.search('foo')).toEqual([{ text: 'foo' }])
})

test('stopwords are passed through a language-aware filter', () => {
  const stopwords = jest.fn((text) => text.length > 1)

  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
    stopwords,
  })

  bs.add('1', { text: 'a foo bar' }, 'en-US')

  expect(stopwords).toHaveBeenCalledWith('a', 'en-US')
  expect(stopwords).toHaveBeenCalledWith('foo', 'en-US')
  expect(stopwords).toHaveBeenCalledWith('bar', 'en-US')
  expect(bs.search('a')).toEqual([])
})

test('empty documents are not indexed', () => {
  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
  })

  bs.add('1', { text: '' })

  expect(bs.search('')).toEqual([])
})

test('undefined fields are not indexed', () => {
  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['id'],
  })

  bs.add('1', { id: 1, text: 'undefined' })
  bs.add('2', { id: 2, text: undefined })
  bs.add('3', { id: 3 })

  expect(bs.search('undefined')).toEqual([{ id: 1 }])
})

test('tokens are passed through a language-aware stemmer', () => {
  const stemmer = jest.fn((text) => text.substring(0, 3))

  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
    stemmer,
  })

  bs.add('1', { text: 'foobar foobaz foöbán' }, 'en-US')

  expect(stemmer).toHaveBeenCalledWith('foobar', 'en-US')
  expect(stemmer).toHaveBeenCalledWith('foobaz', 'en-US')
  expect(stemmer).toHaveBeenCalledWith('fooban', 'en-US')
  expect(bs.search('foo', 'en-GB')).toEqual([{ text: 'foobar foobaz foöbán' }])
  expect(stemmer).toHaveBeenCalledWith('foo', 'en-GB')
})

test('tokens can be generated with a custom tokenizer', () => {
  const tokenizer = jest.fn((text) => text.split('-'))

  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
    tokenizer,
  })

  bs.add('1', { text: 'foo-bar' }, 'en-US')

  expect(tokenizer).toHaveBeenCalledWith('foo-bar', 'en-US')
  expect(bs.search('foo', 'en-GB')).toEqual([{ text: 'foo-bar' }])
})

test('document fields can be preprocessed for the index', () => {
  const preprocess = jest.fn((text) => text.replace(/-/g, ' '))

  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
    preprocess,
  })

  bs.add('1', { text: 'foo-bar' })

  expect(preprocess).toHaveBeenCalledWith('foo-bar', 'text', {
    text: 'foo-bar',
  })
  expect(bs.search('foo')).toEqual([{ text: 'foo-bar' }])
})

test('document fields can be preprocessed', () => {
  const bs = new BloomSearch<Record<string, string>>({
    fields: ['text'],
    summary: ['text'],
    preprocess: (text) => text.replace(/:/g, ' '),
  })

  bs.add('1', { text: 'foo:bar' })

  expect(bs.search('foo')).toEqual([{ text: 'foo:bar' }])
})

test('index can be searched for multiple terms', () => {
  const bs = new BloomSearch({
    fields: ['text'],
    summary: ['text'],
  })

  bs.add('1', { text: 'foo bar' })
  bs.add('2', { text: 'foo baz' })

  expect(bs.search('bar baz')).toEqual([
    { text: 'foo bar' },
    { text: 'foo baz' },
  ])
})

test('minSize prevents false positives in small documents', () => {
  const bs = new BloomSearch({
    fields: { id: 0, content: 1 },
    summary: ['id'],
    errorRate: 0.0001,
    minSize: 16,
  })

  bs.add('1', {
    id: '1',
    content: `realized what aroused greatest apprehension disquiet fossilized
    existence signs without meaning rather astonishing experience nothing can
    entirely divested emanation meaning michal ajvaz other city`,
  })

  expect(bs.search('ab')).toEqual([])
})

describe('+required term search', () => {
  it('includes only results where the required term is found', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
    })

    bs.add('1', { text: 'foo bar' })
    bs.add('2', { text: 'foo baz' })

    expect(bs.search('foo +bar')).toEqual([{ text: 'foo bar' }])
  })

  it('sorts matches using counts of all terms', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
    })

    bs.add('1', { text: 'foo bar' })
    bs.add('2', { text: 'foo foo bar' })

    expect(bs.search('foo +bar')).toEqual([
      { text: 'foo foo bar' },
      { text: 'foo bar' },
    ])
  })

  it('intersects results', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
    })

    bs.add('1', { text: 'foo bar' })
    bs.add('2', { text: 'foo baz' })

    expect(bs.search('+bar +baz')).toEqual([])
  })
})

describe('-excluded term search', () => {
  it('hides results where the excluded term is found', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
    })

    bs.add('1', { text: 'foo bar' })
    bs.add('2', { text: 'foo baz' })

    expect(bs.search('foo -bar')).toEqual([{ text: 'foo baz' }])
  })
})

describe('serialisation', () => {
  it('serialises an instance', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
    })
    bs.add('1', { text: 'foo' })

    const serialised = JSON.stringify(bs.index)

    expect(JSON.parse(serialised)).toEqual({
      version: 1,
      documents: {
        '1': {
          signatures: {
            1: {
              filter: [664200],
              hashes: 14,
              seed: 12648430,
              size: 20,
            },
          },
          summary: {
            text: 'foo',
          },
        },
      },
    })
  })
})

describe('serialised instance hydration', () => {
  it('loads an index', () => {
    const options = {
      fields: ['text'],
      summary: ['text'],
    }
    const previous = new BloomSearch(options)
    previous.add('1', { text: 'previous foo' })
    const current = new BloomSearch(options)

    current.load(JSON.parse(JSON.stringify(previous.index)))
    current.add('2', { text: 'additional foo' })

    expect(current.search('foo')).toEqual([
      { text: 'previous foo' },
      { text: 'additional foo' },
    ])
  })

  it('replaces an index', () => {
    const options = {
      fields: ['text'],
      summary: ['text'],
    }

    const previous = new BloomSearch(options)
    previous.add('1', { text: 'previous' })

    const current = new BloomSearch(options)
    current.add('2', { text: 'replaced' })
    current.load(JSON.parse(JSON.stringify(previous.index)))

    expect(current.search('previous')).toEqual([{ text: 'previous' }])
    expect(current.search('replaced')).toEqual([])
  })
})

describe('ngram search', () => {
  it('supports digram phrases', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
      ngrams: 2,
    })

    bs.add('1', { text: 'foo bar baz' })
    bs.add('2', { text: 'foo baz bar' })

    expect(bs.search('"foo bar"')).toEqual([{ text: 'foo bar baz' }])
  })

  it('supports trigram phrases', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
      ngrams: 3,
    })

    bs.add('1', { text: 'foo bar bar bar' })
    bs.add('2', { text: 'foo foo foo bar' })

    expect(bs.search('"foo bar bar"')).toEqual([{ text: 'foo bar bar bar' }])
    expect(bs.search('"foo foo"')).toEqual([{ text: 'foo foo foo bar' }])
  })

  it('allows lowercase matches', () => {
    const bs = new BloomSearch({
      fields: ['text'],
      summary: ['text'],
      ngrams: 2,
    })

    bs.add('1', { text: 'foo BAR' })
    bs.add('2', { text: 'FOO bar' })

    expect(bs.search('"fOo bAr"')).toEqual([
      { text: 'foo BAR' },
      { text: 'FOO bar' },
    ])
  })
})
