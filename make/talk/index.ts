import st from '@lancejpollard/script-tree'

// https://en.wikipedia.org/wiki/Hangul_Syllables
// first hangul jamo syllable
const Xi = parseInt('AC00', 16)
// last hangul jamo syllable
const Xf = parseInt('D7A3', 16)
let X = Xi

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
              VOWELS.push({ i, x: getSingleGlyph(), o })
            })
          })
        })
      })
    })
  })
})

export const SYMBOLS = [
  { i: '=.', x: getSingleGlyph(), o: '.' },
  { i: '=?', x: getSingleGlyph(), o: '?' },
  { i: '=!', x: getSingleGlyph(), o: '!' },
  { i: '=+', x: getSingleGlyph(), o: '+' },
  { i: '=-', x: getSingleGlyph(), o: '-' },
  { i: '>', x: getSingleGlyph(), o: '>' },
  { i: '<', x: getSingleGlyph(), o: '<' },
  { i: '/', x: getSingleGlyph(), o: '/' },
  { i: '\\', x: getSingleGlyph(), o: '\\' },
  { i: '|', x: getSingleGlyph(), o: '|' },
  { i: '(', x: getSingleGlyph(), o: '(' },
  { i: ')', x: getSingleGlyph(), o: ')' },
  { i: '[', x: getSingleGlyph(), o: '[' },
  { i: ']', x: getSingleGlyph(), o: ']' },
  { i: ' ', x: getSingleGlyph(), o: ' ' },
]

export const NUMERALS = [
  { i: '0', x: getSingleGlyph(), o: '0' },
  { i: '1', x: getSingleGlyph(), o: '1' },
  { i: '2', x: getSingleGlyph(), o: '2' },
  { i: '3', x: getSingleGlyph(), o: '3' },
  { i: '4', x: getSingleGlyph(), o: '4' },
  { i: '5', x: getSingleGlyph(), o: '5' },
  { i: '6', x: getSingleGlyph(), o: '6' },
  { i: '7', x: getSingleGlyph(), o: '7' },
  { i: '8', x: getSingleGlyph(), o: '8' },
  { i: '9', x: getSingleGlyph(), o: '9' },
]

export const CONSONANTS = [
  { i: '@', x: getSingleGlyph(), o: `@` },
  { i: 'h~', x: getSingleGlyph(), o: `ɦ` },
  { i: 'm', x: getSingleGlyph(), o: `m` },
  { i: 'N', x: getSingleGlyph(), o: `n${m.d.dot}` },
  { i: 'n', x: getSingleGlyph(), o: `n` },
  { i: 'q', x: getSingleGlyph(), o: `n${m.u.dot}` },
  { i: 'G~', x: getSingleGlyph(), o: `g${m.u.tilde}` },
  { i: 'G', x: getSingleGlyph(), o: `g${m.u.dot}` },
  { i: 'g?', x: getSingleGlyph(), o: `g${m.u.grave}` },
  { i: 'g', x: getSingleGlyph(), o: `g` },
  { i: "'", x: getSingleGlyph(), o: `'` },
  { i: 'Q', x: getSingleGlyph(), o: `q${m.u.dot}` },
  { i: 'd?', x: getSingleGlyph(), o: `d${m.d.grave}` },
  { i: 'd!', x: getSingleGlyph(), o: `d${m.d.acute}` },
  { i: 'd*', x: getSingleGlyph(), o: `d${m.d.down}` },
  { i: 'd.', x: getSingleGlyph(), o: `d${m.d.macron}` },
  { i: 'D', x: getSingleGlyph(), o: `d${m.d.dot}` },
  { i: 'dQ~', x: getSingleGlyph(), o: `d${m.d.tilde}` },
  { i: 'd', x: getSingleGlyph(), o: `d` },
  { i: 'b?', x: getSingleGlyph(), o: `b${m.d.grave}` },
  { i: 'b!', x: getSingleGlyph(), o: `b${m.d.acute}` },
  { i: 'b', x: getSingleGlyph(), o: `b` },
  { i: 'p!', x: getSingleGlyph(), o: `p${m.u.acute}` },
  { i: 'p*', x: getSingleGlyph(), o: `p${m.u.up}` },
  { i: 'p.', x: getSingleGlyph(), o: `t${m.u.macron}` },
  { i: 'p@', x: getSingleGlyph(), o: `x${m.u.down}` },
  { i: 'p', x: getSingleGlyph(), o: `p` },
  { i: 'T!', x: getSingleGlyph(), o: `t${m.d.dot}${m.d.acute}` },
  { i: 'T', x: getSingleGlyph(), o: `t${m.d.dot}` },
  { i: 't!', x: getSingleGlyph(), o: `t${m.d.acute}` },
  { i: 't*', x: getSingleGlyph(), o: `t${m.d.down}` },
  { i: 'tQ~', x: getSingleGlyph(), o: `t${m.d.tilde}` },
  { i: 't@', x: getSingleGlyph(), o: `t${m.d.up}` },
  { i: 't.', x: getSingleGlyph(), o: `t${m.d.macron}` },
  { i: 't', x: getSingleGlyph(), o: `t` },
  { i: 'k!', x: getSingleGlyph(), o: `k${m.d.acute}` },
  { i: 'k.', x: getSingleGlyph(), o: `k${m.d.macron}` },
  { i: 'k*', x: getSingleGlyph(), o: `k${m.d.down}` },
  { i: 'K!', x: getSingleGlyph(), o: `k${m.d.dot}${m.d.acute}` },
  { i: 'K', x: getSingleGlyph(), o: `k${m.d.dot}` },
  { i: 'k', x: getSingleGlyph(), o: `k` },
  { i: 'H!', x: getSingleGlyph(), o: `h${m.d.dot}${m.d.acute}` },
  { i: 'H', x: getSingleGlyph(), o: `h${m.d.dot}` },
  { i: 'h!', x: getSingleGlyph(), o: `ħ` },
  { i: 'h', x: getSingleGlyph(), o: `h` },
  { i: 'J', x: getSingleGlyph(), o: `ȷ̈` },
  { i: 'j!', x: getSingleGlyph(), o: `j${m.u.acute}` },
  { i: 'j', x: getSingleGlyph(), o: `j` },
  { i: 'S!', x: getSingleGlyph(), o: `s${m.d.dot}${m.u.acute}` },
  { i: 's!', x: getSingleGlyph(), o: `s${m.u.acute}` },
  { i: 'S', x: getSingleGlyph(), o: `s${m.d.dot}` },
  { i: 'sQ~', x: getSingleGlyph(), o: `s${m.d.tilde}` },
  { i: 's@', x: getSingleGlyph(), o: `s${m.d.up}` },
  { i: 's', x: getSingleGlyph(), o: `s` },
  { i: 'F', x: getSingleGlyph(), o: `f${m.d.dot}` },
  { i: 'f!', x: getSingleGlyph(), o: `f${m.d.acute}` },
  { i: 'f', x: getSingleGlyph(), o: `f` },
  { i: 'V', x: getSingleGlyph(), o: `v${m.d.dot}` },
  { i: 'v', x: getSingleGlyph(), o: `v` },
  { i: 'z!', x: getSingleGlyph(), o: `z${m.u.acute}` },
  { i: 'zQ~', x: getSingleGlyph(), o: `z${m.d.tilde}` },
  { i: 'z', x: getSingleGlyph(), o: `z` },
  { i: 'Z!', x: getSingleGlyph(), o: `z${m.d.dot}${m.u.acute}` },
  { i: 'Z', x: getSingleGlyph(), o: `z${m.d.dot}` },
  { i: 'CQ~', x: getSingleGlyph(), o: `c${m.d.dot}${m.u.tilde}` },
  { i: 'C', x: getSingleGlyph(), o: `c${m.d.dot}` },
  { i: 'cQ~', x: getSingleGlyph(), o: `c${m.u.tilde}` },
  { i: 'c', x: getSingleGlyph(), o: `c` },
  { i: 'L', x: getSingleGlyph(), o: `l${m.d.dot}` },
  { i: 'l*', x: getSingleGlyph(), o: `l${m.d.down}` },
  { i: 'lQ~', x: getSingleGlyph(), o: `l${m.d.tilde}` },
  { i: 'l', x: getSingleGlyph(), o: `l` },
  { i: 'R', x: getSingleGlyph(), o: `r${m.d.dot}` },
  { i: 'rQ~', x: getSingleGlyph(), o: `r${m.u.tilde}` },
  { i: 'r', x: getSingleGlyph(), o: `r${m.u.dot}` },
  { i: 'x!', x: getSingleGlyph(), o: `x${m.u.acute}` },
  { i: 'X!', x: getSingleGlyph(), o: `x${m.d.dot}${m.u.acute}` },
  { i: 'X', x: getSingleGlyph(), o: `x${m.d.dot}` },
  { i: 'x@', x: getSingleGlyph(), o: `x${m.d.up}` },
  { i: 'x', x: getSingleGlyph(), o: `x` },
  { i: 'W', x: getSingleGlyph(), o: `w${m.u.dot}` },
  { i: 'w!', x: getSingleGlyph(), o: `w${m.u.acute}` },
  { i: 'w~', x: getSingleGlyph(), o: `w${m.d.dot}` },
  { i: 'w', x: getSingleGlyph(), o: `w` },
  { i: 'y~', x: getSingleGlyph(), o: `y${m.u.dot}` },
  { i: 'y', x: getSingleGlyph(), o: `y` },
]

export const GLYPHS = [
  ...VOWELS,
  ...CONSONANTS,
  ...SYMBOLS,
  ...NUMERALS,
]

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

function getSingleGlyph() {
  if (X === Xf) {
    throw new Error(`Too many glyphs created`)
  }

  return String.fromCodePoint(X++)
}
