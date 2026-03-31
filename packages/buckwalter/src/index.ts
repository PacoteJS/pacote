const arabicToBuckwalter = new Map<string, string>([
  ['ء', "'"],
  ['آ', '|'],
  ['أ', '>'],
  ['ؤ', '&'],
  ['إ', '<'],
  ['ئ', '}'],
  ['ا', 'A'],
  ['ب', 'b'],
  ['ة', 'p'],
  ['ت', 't'],
  ['ث', 'v'],
  ['ج', 'j'],
  ['ح', 'H'],
  ['خ', 'x'],
  ['د', 'd'],
  ['ذ', '*'],
  ['ر', 'r'],
  ['ز', 'z'],
  ['س', 's'],
  ['ش', '$'],
  ['ص', 'S'],
  ['ض', 'D'],
  ['ط', 'T'],
  ['ظ', 'Z'],
  ['ع', 'E'],
  ['غ', 'g'],
  ['ـ', '_'],
  ['ف', 'f'],
  ['ق', 'q'],
  ['ك', 'k'],
  ['ل', 'l'],
  ['م', 'm'],
  ['ن', 'n'],
  ['ه', 'h'],
  ['و', 'w'],
  ['ى', 'Y'],
  ['ي', 'y'],
  ['ً', 'F'],
  ['ٌ', 'N'],
  ['ٍ', 'K'],
  ['َ', 'a'],
  ['ُ', 'u'],
  ['ِ', 'i'],
  ['ّ', '~'],
  ['ْ', 'o'],
  ['ٰ', '`'],
  ['ٱ', '{'],
])

const buckwalterToArabic = new Map<string, string>(
  [...arabicToBuckwalter.entries()].map(([arabic, latin]) => [latin, arabic]),
)

function transliterateWithMap(input: string, map: Map<string, string>): string {
  return [...input].map((character) => map.get(character) ?? character).join('')
}

export function transliterate(arabic: string): string {
  return transliterateWithMap(arabic, arabicToBuckwalter)
}

export function transliterateReverse(latin: string): string {
  return transliterateWithMap(latin, buckwalterToArabic)
}
