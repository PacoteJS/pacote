export const defaultTokenizer = (text: string): string[] =>
  text
    .normalize('NFD')
    .toLowerCase()
    .split(/[\s-]+/)
    .map((token) => token.replace(/\W/gi, ''))
