import { assert, nat, property, oneof, string, uint8Array } from 'fast-check'
import { XXHash64 } from 'xxhash-addon'
import { sanityBuffer } from './sanity'
import { xxh64 } from '../src/index'

describe('XXHash64', () => {
  test('default seed value is 0', () => {
    const h1 = xxh64().update(sanityBuffer.toString()).digest('hex')
    const h2 = xxh64(0).update(sanityBuffer.toString()).digest('hex')
    expect(h2).toBe(h1)
  })

  test('compare to XXH64 reference implementation', () => {
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
        }
      )
    )
  })

  const SEED_32 = 2654435761
  // const SEED_64 = Buffer.from([0x9e, 0x37, 0x79, 0xb1, 0x85, 0xeb, 0xca, 0x8d])

  test.each([
    [0, 0, 'ef46db3751d8e999'],
    [0, SEED_32, 'ac75fda2929b17ef'],
    [1, 0, 'e934a84adb052768'],
    [1, SEED_32, '5014607643a9b4c3'],
    [4, 0, '9136a0dca57457ee'],
    [14, 0, '8282dcc4994e35c8'],
    [14, SEED_32, 'c3bd6bf63deb6df0'],
    /* FIXME */ [222, 0, 'b641ae8cb691c174'],
    /* FIXME */ [222, SEED_32, '20cb8ab7ae10c14a'],
  ])('sanity buffer (length %d, seed %d)', (length, seed, expected) => {
    const data = sanityBuffer.reduce((copy, value, offset) => {
      copy[offset] = value
      return copy
    }, new Uint8Array(length))

    const actual = xxh64(seed).update(data.buffer).digest('hex')
    expect(actual).toBe(expected)
  })
})
