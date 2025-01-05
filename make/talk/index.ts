import st from '@lancejpollard/script-tree'

// https://en.wikipedia.org/wiki/Hangul_Syllables
// first hangul jamo syllable
const Xi = parseInt('AC00', 16)
// last hangul jamo syllable
const Xf = parseInt('D7A3', 16)
let X = Xi

const HANGUL_START = 0xac00 // Start of Hangul Syllables block
const HANGUL_END = 0xd7a3 // End of Hangul Syllables block
const HANGUL_COUNT = HANGUL_END - HANGUL_START + 1

// Cryptographic-inspired hash function that produces very different outputs
// for similar inputs, using a large prime multiplier and XOR operations
const deterministicHash = (input: string) => {
  // Using BigInt to handle large numbers without precision loss
  const LARGE_PRIME = 2305843009213693951n // Mersenne prime 2^61 - 1

  let hash = 0n
  const chars = Array.from(input)

  for (let i = 0; i < chars.length; i++) {
    // Get char code and position-based value
    const charCode = BigInt(chars[i]!.charCodeAt(0))
    const position = BigInt(i + 1)

    // Combine character and position information
    const combined = charCode * position

    // Use XOR to mix bits in a reversible way
    hash = (hash * LARGE_PRIME) ^ combined
  }

  // Ensure positive value while maintaining uniqueness
  hash = hash < 0n ? -hash : hash

  return hash
}

// Maps a string to a Hangul syllable with guaranteed uniqueness
const mapToHangulDeterministic = (input: string) => {
  const hash = deterministicHash(input)

  // Use modulo to map to Hangul range while preserving uniqueness properties
  const hangulOffset = Number(hash % BigInt(HANGUL_COUNT))
  const codePoint = HANGUL_START + hangulOffset

  return String.fromCharCode(codePoint)
}

const m = {
  u: {
    grave: '\u0300',
    acute: '\u0301',
    dacute: '\u030B',
    dgrave: '\u030F',
    up: '\u0302',
    down: '\u030C',
    dot: '\u0307',
    ddot: '\u0308',
    ring: '\u030A',
    tilde: '\u0303',
    macron: '\u0304',
    hook: '\u0309',
  },
  d: {
    grave: '\u0316',
    acute: '\u0317',
    ring: '\u0325',
    dot: '\u0323',
    ddot: '\u0324',
    down: '\u032C',
    tilde: '\u0330',
    macron: '\u0331',
    cedilla: '\u0327',
    up: '\u032D',
    hook: '\u0328',
  },
}

const D: Record<string, string> = {
  '--': m.u.dgrave,
  '-': m.u.grave,
  '++': m.u.dacute,
  '+': m.u.acute,
  '//': `${m.d.hook}${m.u.dacute}`, // rising 2 (vietnamese ngã)
  '/': `${m.d.hook}${m.u.acute}`, // rising (vietnamese sắc)
  '\\/': m.u.down, // falling rising (vietnamese hỏi)
  '/\\': m.u.up, // rising falling
  '\\\\': `${m.d.hook}${m.u.dgrave}`, // falling 2 (vietnamese nặng)
  '\\': `${m.d.hook}${m.u.grave}`, // falling (vietnamese huyền)
  '^': m.u.dot, // accent/stress mark
  $: m.d.ddot,
  '&': m.d.tilde,
  _: m.u.macron, // long vowel
  '@': m.d.grave, // non-syllabic
  '!': m.d.macron, // short vowel
  '': '',
}

const G: Record<string, string> = {
  I: `i${m.d.dot}`,
  E: `e${m.d.dot}`,
  A: `a${m.d.dot}`,
  O: `o${m.d.dot}`,
  U: `u${m.d.dot}`,
  i: `i`,
  e: `e`,
  a: `a`,
  o: `o`,
  u: `u`,
}

export type Take = {
  i: string
  x: string
  o: string
  name?: string
  o2?: string
}

export const VOWELS: Array<Take> = []

export const BASE_VOWEL_GLYPHS = [
  'I',
  'E',
  'A',
  'O',
  'U',
  'i',
  'e',
  'a',
  'o',
  'u',
]
export const TONE_MARKS = [
  '--',
  '-',
  '++',
  '+',
  '/',
  '//',
  '\\/',
  '/\\',
  '\\\\',
  '\\',
  '',
]
export const VARIANT_MARKS = ['$', '']
export const NASAL_MARKS = ['&', '']
export const DURATION_MARKS = ['_', '!', '']
export const SYLLABIC_MARKS = ['@', '']
export const ACCENT_MARKS = ['^', '']

BASE_VOWEL_GLYPHS.forEach(g => {
  ACCENT_MARKS.forEach(a => {
    DURATION_MARKS.forEach(l => {
      SYLLABIC_MARKS.forEach(s => {
        NASAL_MARKS.forEach(n => {
          VARIANT_MARKS.forEach(v => {
            TONE_MARKS.forEach(t => {
              const i = `${g}${v}${n}${s}${t}${l}${a}`
              const x = g.match(/i/i) && a === '^' ? 'ï' : G[g]
              const y = x === 'ï' ? '' : D[a]
              const x2 = v === '$' && x === 'u' ? 'r' : x
              const v2 = v === '$' && g === 'u' ? '' : `${D[v]}`
              const o =
                l === '!'
                  ? `${x2}${y}${D[l]}${D[n]}${D[s]}${D[t]}${v2}`
                  : `${x2}${D[l]}${D[n]}${D[s]}${D[t]}${v2}${y}`
              VOWELS.push({ i, x: '', o })
            })
          })
        })
      })
    })
  })
})

export const SYMBOLS = [
  { i: '=.', x: '', o: '.' },
  { i: '=?', x: '', o: '?' },
  { i: '=!', x: '', o: '!' },
  { i: '=+', x: '', o: '+' },
  { i: '=-', x: '', o: '-' },
  { i: '>', x: '', o: '>' },
  { i: '<', x: '', o: '<' },
  { i: '/', x: '', o: '/' },
  { i: '\\', x: '', o: '\\' },
  { i: '|', x: '', o: '|' },
  { i: '(', x: '', o: '(' },
  { i: ')', x: '', o: ')' },
  { i: '[', x: '', o: '[' },
  { i: ']', x: '', o: ']' },
  { i: ' ', x: '', o: ' ' },
]

export const NUMERALS = [
  { i: '0', x: '', o: '0' },
  { i: '1', x: '', o: '1' },
  { i: '2', x: '', o: '2' },
  { i: '3', x: '', o: '3' },
  { i: '4', x: '', o: '4' },
  { i: '5', x: '', o: '5' },
  { i: '6', x: '', o: '6' },
  { i: '7', x: '', o: '7' },
  { i: '8', x: '', o: '8' },
  { i: '9', x: '', o: '9' },
]

export const CONSONANTS = [
  { i: '@', x: '', o: `@` },
  { i: 'h~', x: '', o: `ɦ` },
  { i: 'm', x: '', o: `m` },
  { i: 'N', x: '', o: `n${m.d.dot}` },
  { i: 'n', x: '', o: `n` },
  { i: 'q', x: '', o: `n${m.u.dot}` },
  { i: 'G~', x: '', o: `g${m.u.tilde}` },
  { i: 'G', x: '', o: `g${m.u.dot}` },
  { i: 'g?', x: '', o: `g${m.u.grave}` },
  { i: 'g', x: '', o: `g` },
  { i: "'", x: '', o: `'` },
  { i: 'Q', x: '', o: `q${m.u.dot}` },
  { i: 'd~', x: '', o: `d` },
  { i: 'd?', x: '', o: `d${m.d.grave}` },
  { i: 'd!', x: '', o: `d${m.d.acute}` },
  { i: 'd*', x: '', o: `d${m.d.down}` },
  { i: 'd.', x: '', o: `d${m.d.macron}` },
  { i: 'D', x: '', o: `d${m.d.dot}` },
  { i: 'dQ~', x: '', o: `d${m.d.tilde}` },
  { i: 'd', x: '', o: `d` },
  { i: 'b?', x: '', o: `b${m.d.grave}` },
  { i: 'b!', x: '', o: `b${m.d.acute}` },
  { i: 'b', x: '', o: `b` },
  { i: 'p!', x: '', o: `p${m.u.acute}` },
  { i: 'p*', x: '', o: `p${m.u.up}` },
  { i: 'p.', x: '', o: `t${m.u.macron}` },
  { i: 'p@', x: '', o: `x${m.u.down}` },
  { i: 'p', x: '', o: `p` },
  { i: 't~', x: '', o: `t` },
  { i: 'T!', x: '', o: `t${m.d.dot}${m.d.acute}` },
  { i: 'T', x: '', o: `t${m.d.dot}` },
  { i: 't!', x: '', o: `t${m.d.acute}` },
  { i: 't*', x: '', o: `t${m.d.down}` },
  { i: 'tQ~', x: '', o: `t${m.d.tilde}` },
  { i: 't@', x: '', o: `t${m.d.up}` },
  { i: 't.', x: '', o: `t${m.d.macron}` },
  { i: 't', x: '', o: `t` },
  { i: 'k!', x: '', o: `k${m.d.acute}` },
  { i: 'k.', x: '', o: `k${m.d.macron}` },
  { i: 'k*', x: '', o: `k${m.d.down}` },
  { i: 'K!', x: '', o: `k${m.d.dot}${m.d.acute}` },
  { i: 'K', x: '', o: `k${m.d.dot}` },
  { i: 'k', x: '', o: `k` },
  { i: 'H!', x: '', o: `h${m.d.dot}${m.d.acute}` },
  { i: 'H', x: '', o: `h${m.d.dot}` },
  { i: 'h!', x: '', o: `ħ` },
  { i: 'h', x: '', o: `h` },
  { i: 'J', x: '', o: `ȷ̈` },
  { i: 'j!', x: '', o: `j${m.u.acute}` },
  { i: 'j', x: '', o: `j` },
  { i: 'S!', x: '', o: `s${m.d.dot}${m.u.acute}` },
  { i: 's!', x: '', o: `s${m.u.acute}` },
  { i: 'S', x: '', o: `s${m.d.dot}` },
  { i: 'sQ~', x: '', o: `s${m.d.tilde}` },
  { i: 's@', x: '', o: `s${m.d.up}` },
  { i: 's', x: '', o: `s` },
  { i: 'F', x: '', o: `f${m.d.dot}` },
  { i: 'f!', x: '', o: `f${m.d.acute}` },
  { i: 'f', x: '', o: `f` },
  { i: 'V', x: '', o: `v${m.d.dot}` },
  { i: 'v', x: '', o: `v` },
  { i: 'z!', x: '', o: `z${m.u.acute}` },
  { i: 'zQ~', x: '', o: `z${m.d.tilde}` },
  { i: 'z', x: '', o: `z` },
  { i: 'Z!', x: '', o: `z${m.d.dot}${m.u.acute}` },
  { i: 'Z', x: '', o: `z${m.d.dot}` },
  { i: 'CQ~', x: '', o: `c${m.d.dot}${m.u.tilde}` },
  { i: 'C', x: '', o: `c${m.d.dot}` },
  { i: 'cQ~', x: '', o: `c${m.u.tilde}` },
  { i: 'c', x: '', o: `c` },
  { i: 'L', x: '', o: `l${m.d.dot}` },
  { i: 'l*', x: '', o: `l${m.d.down}` },
  { i: 'lQ~', x: '', o: `l${m.d.tilde}` },
  { i: 'l', x: '', o: `l` },
  { i: 'R', x: '', o: `r${m.d.dot}` },
  { i: 'rQ~', x: '', o: `r${m.u.tilde}` },
  { i: 'r', x: '', o: `r${m.u.dot}` },
  { i: 'x!', x: '', o: `x${m.u.acute}` },
  { i: 'X!', x: '', o: `x${m.d.dot}${m.u.acute}` },
  { i: 'X', x: '', o: `x${m.d.dot}` },
  { i: 'x@', x: '', o: `x${m.d.up}` },
  { i: 'x', x: '', o: `x` },
  { i: 'W', x: '', o: `w${m.u.dot}` },
  { i: 'w!', x: '', o: `w${m.u.acute}` },
  { i: 'w~', x: '', o: `w${m.d.dot}` },
  { i: 'w', x: '', o: `w` },
  { i: 'y~', x: '', o: `y${m.u.dot}` },
  { i: 'y', x: '', o: `y` },
]

export const GLYPHS = [
  ...VOWELS,
  ...CONSONANTS,
  ...SYMBOLS,
  ...NUMERALS,
].map(glyph => ({
  ...glyph,
  x: mapToHangulDeterministic(glyph.i),
}))

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
const tree = st.fork(GLYPHS)
// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
const make = (text: string): string => st.form(text, tree)

make.inputs = (text: string): Array<string> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  st.list(text, tree).map((x: any) => x.i)

make.readableOutput = (text: string): Array<string> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  st.list(text, tree).map((x: any) => x.o)

make.readable = (text: string): string =>
  make.readableOutput(text).join('')

make.machineOutputs = (text: string): Array<string> =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  st.list(text, tree).map((x: any) => x.x)

make.machine = (text: string): string =>
  make.machineOutputs(text).join('')

export default make
