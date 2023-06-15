export function toUint32(hex: string): number {
  return parseInt(hex.substring(8, 16), 16)
}
