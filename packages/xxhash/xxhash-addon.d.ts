declare module 'xxhash-addon' {
  type BinaryToTextEncoding = 'base64' | 'hex'
  type CharacterEncoding = 'utf8' | 'utf-8' | 'utf16le' | 'latin1'
  type LegacyCharacterEncoding = 'ascii' | 'binary' | 'ucs2' | 'ucs-2'

  type Encoding =
    | BinaryToTextEncoding
    | CharacterEncoding
    | LegacyCharacterEncoding

  export class XXHash64 {
    constructor(seed: number)
    hash(buffer: Buffer): XXHash64
    toString(encoding?: Encoding): string
  }
}
