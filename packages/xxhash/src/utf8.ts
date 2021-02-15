export function toUTF8Array(data: string): Uint8Array {
  const utf8 = []
  for (let i = 0; i < data.length; i++) {
    let charCode = data.charCodeAt(i)
    if (charCode < 0x80) {
      utf8.push(charCode)
    } else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f))
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8.push(
        0xe0 | (charCode >> 12),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      )
    } else {
      i++
      charCode =
        0x10000 + (((charCode & 0x3ff) << 10) | (data.charCodeAt(i) & 0x3ff))
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f)
      )
    }
  }

  return new Uint8Array(utf8)
}
