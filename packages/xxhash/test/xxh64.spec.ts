import { assert, nat, property, oneof, string, uint8Array } from 'fast-check'
import { XXHash64 } from 'xxhash-addon'
import { sanityBuffer } from './sanity'
import { xxh64 } from '../src/index'

function clonedSlice(buffer: Buffer, length: number): Uint8Array {
  return buffer.reduce((clone, value, index) => {
    clone[index] = value
    return clone
  }, new Uint8Array(length))
}

describe('XXHash64', () => {
  test('default seed value is 0', () => {
    const h1 = xxh64().update(sanityBuffer.toString()).digest('hex')
    const h2 = xxh64(0).update(sanityBuffer.toString()).digest('hex')
    expect(h2).toBe(h1)
  })

  test('XXH64 reference implementation comparison', () => {
    assert(
      property(
        nat(),
        oneof(string({ maxLength: 256 }), uint8Array({ maxLength: 256 })),
        (seed, data) => {
          const referenceHash = new XXHash64(seed)
            .hash(Buffer.from(data))
            .toString('hex')
          const hash = xxh64(seed).update(data).digest('hex')
          expect(hash).toBe(referenceHash)
        },
      ),
    )
  })

  test.each([
    [0, 0, 'ef46db3751d8e999'],
    [0, 2654435761, 'ac75fda2929b17ef'],
    [1, 0, 'e934a84adb052768'],
    [1, 2654435761, '5014607643a9b4c3'],
    [4, 0, '9136a0dca57457ee'],
    [14, 0, '8282dcc4994e35c8'],
    [14, 2654435761, 'c3bd6bf63deb6df0'],
    [222, 0, 'b641ae8cb691c174'],
    [222, 2654435761, '20cb8ab7ae10c14a'],
  ])('sanity buffer (length %d, seed %d)', (length, seed, expected) => {
    const data = clonedSlice(sanityBuffer, length)

    const actual = xxh64(seed).update(data.buffer).digest('hex')
    expect(actual).toBe(expected)
  })

  test('chunked updates', () => {
    assert(
      property(nat(), string({ maxLength: 256 }), (seed, data) => {
        const hashFromWhole = xxh64(seed).update(data).digest('hex')
        const hashFromChunks = data
          .split('')
          .reduce((hasher, element) => hasher.update(element), xxh64(seed))
          .digest('hex')
        expect(hashFromChunks).toBe(hashFromWhole)
      }),
    )
  })

  test('hasher is reset after digest', () => {
    const hasher = xxh64(2654435761)
    const h1 = hasher.update(sanityBuffer.toString()).digest('hex')
    const h2 = hasher.update(sanityBuffer.toString()).digest('hex')
    expect(h2).toBe(h1)
  })

  test('resetting the hasher without a seed uses the original seed', () => {
    const hasher = xxh64(2654435761)
    const h1 = hasher.update(sanityBuffer.toString()).digest('hex')
    hasher.reset()
    const h2 = hasher.update(sanityBuffer.toString()).digest('hex')
    expect(h2).toBe(h1)
  })
})
