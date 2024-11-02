import merge from 'lodash/merge'

import {
  ACCENT_MARKS,
  BASE_VOWEL_GLYPHS,
  DURATION_MARKS,
  NASAL_MARKS,
  SYLLABIC_MARKS,
  TONE_MARKS,
  VARIANT_MARKS,
} from '.'

type Mark = {
  aspiration?: boolean
  click?: boolean
  dentalization?: boolean
  ejection?: boolean
  elongation?: boolean
  implosion?: boolean
  labialization?: boolean
  nasalization?: boolean
  palatalization?: boolean
  pharyngealization?: boolean
  stop?: boolean
  stress?: boolean
  tense?: boolean
  tone?:
    | 'extra high'
    | 'high'
    | 'low'
    | 'extra low'
    | 'rising'
    | 'rising 2'
    | 'falling'
    | 'falling 2'
    | 'rising falling'
    | 'falling rising'
  truncation?: boolean
  type?: 'punctuation' | 'vowel' | 'consonant'
  value?: string
  velarization?: boolean
  voicelessness?: boolean
}

const MARK: Record<string, Mark> = {
  '=.': { type: 'punctuation', value: '.' },
  '=@': { type: 'punctuation', value: '@' },
  '=?': { type: 'punctuation', value: '?' },
  '=!': { type: 'punctuation', value: '!' },
  '=+': { type: 'punctuation', value: '+' },
  '=-': { type: 'punctuation', value: '-' },
  'h!': { voicelessness: true },
  'h~': { aspiration: true },
  'w~': { labialization: true },
  'y~': { palatalization: true },
  'G~': { velarization: true },
  'Q~': { pharyngealization: true },
  'l*': { type: 'consonant', value: 'l', click: true },
  't*': { type: 'consonant', value: 't', click: true },
  'd*': { type: 'consonant', value: 'd', click: true },
  'k*': { type: 'consonant', value: 'k', click: true },
  'p*': { type: 'consonant', value: 'p', click: true },
  'n!': { type: 'consonant', value: 'n', ejection: true },
  'q!': { type: 'consonant', value: 'q', ejection: true },
  'g!': { type: 'consonant', value: 'g', ejection: true },
  'd!': { type: 'consonant', value: 'd', ejection: true },
  'b!': { type: 'consonant', value: 'b', ejection: true },
  'p!': { type: 'consonant', value: 'p', ejection: true },
  't!': { type: 'consonant', value: 't', ejection: true },
  'k!': { type: 'consonant', value: 'k', ejection: true },
  's!': { type: 'consonant', value: 's', ejection: true },
  'f!': { type: 'consonant', value: 'f', ejection: true },
  'v!': { type: 'consonant', value: 'v', ejection: true },
  'z!': { type: 'consonant', value: 'z', ejection: true },
  'j!': { type: 'consonant', value: 'j', ejection: true },
  'x!': { type: 'consonant', value: 'x', ejection: true },
  'c!': { type: 'consonant', value: 'c', ejection: true },
  'C!': { type: 'consonant', value: 'C', ejection: true },
  'y!': { type: 'consonant', value: 'y', ejection: true },
  'w!': { type: 'consonant', value: 'w', ejection: true },
  'Q!': { type: 'consonant', value: 'Q', ejection: true },
  'l!': { type: 'consonant', value: 'l', ejection: true },
  'r!': { type: 'consonant', value: 'r', ejection: true },

  m: { type: 'consonant', value: 'm' },
  n: { type: 'consonant', value: 'n' },
  N: { type: 'consonant', value: 'N' },
  q: { type: 'consonant', value: 'q' },
  g: { type: 'consonant', value: 'g' },
  d: { type: 'consonant', value: 'd' },
  b: { type: 'consonant', value: 'b' },
  p: { type: 'consonant', value: 'p' },
  t: { type: 'consonant', value: 't' },
  T: { type: 'consonant', value: 'T' },
  k: { type: 'consonant', value: 'k' },
  K: { type: 'consonant', value: 'K' },
  h: { type: 'consonant', value: 'h' },
  H: { type: 'consonant', value: 'H' },
  s: { type: 'consonant', value: 's' },
  S: { type: 'consonant', value: 'S' },
  f: { type: 'consonant', value: 'f' },
  F: { type: 'consonant', value: 'F' },
  V: { type: 'consonant', value: 'V' },
  v: { type: 'consonant', value: 'v' },
  z: { type: 'consonant', value: 'z' },
  Z: { type: 'consonant', value: 'Z' },
  j: { type: 'consonant', value: 'j' },
  J: { type: 'consonant', value: 'J' },
  x: { type: 'consonant', value: 'x' },
  X: { type: 'consonant', value: 'X' },
  c: { type: 'consonant', value: 'c' },
  'C~': { type: 'consonant', value: 'C~' },
  C: { type: 'consonant', value: 'C' },
  y: { type: 'consonant', value: 'y' },
  W: { type: 'consonant', value: 'W' },
  w: { type: 'consonant', value: 'w' },
  Q: { type: 'consonant', value: 'Q' },
  "'": { type: 'consonant', value: "'" },
  l: { type: 'consonant', value: 'l' },
  L: { type: 'consonant', value: 'L' },
  r: { type: 'consonant', value: 'r' },
  R: { type: 'consonant', value: 'R' },
}

const EXTRA_FEATURES: Record<string, Mark> = {
  '--': { tone: 'extra low' },
  '-': { tone: 'low' },
  '++': { tone: 'extra high' },
  '+': { tone: 'high' },
  '//': { tone: 'rising 2' }, // rising 2 (vietnamese ngã)
  '/': { tone: 'rising' }, // rising (vietnamese sắc)
  '\\/': { tone: 'falling rising' }, // falling rising (vietnamese hỏi)
  '/\\': { tone: 'rising falling' }, // rising falling
  '\\\\': { tone: 'falling 2' }, // falling 2 (vietnamese nặng)
  '\\': { tone: 'falling' }, // falling (vietnamese huyền)
  '@': { tense: true },
  '.': { stop: true },
  '!': { truncation: true },
  _: { elongation: true },
  '^': { stress: true },
  '?': { implosion: true },
  '*': { click: true },
  '~': { dentalization: true },
  '&': { nasalization: true },
}

BASE_VOWEL_GLYPHS.forEach(g => {
  ACCENT_MARKS.forEach(a => {
    DURATION_MARKS.forEach(l => {
      SYLLABIC_MARKS.forEach(s => {
        NASAL_MARKS.forEach(n => {
          VARIANT_MARKS.forEach(v => {
            TONE_MARKS.forEach(t => {
              const i = `${g}${v}${n}${s}${t}${l}${a}`
              const features = merge(
                { type: 'vowel', value: `${g}${v}` },
                EXTRA_FEATURES[n],
                EXTRA_FEATURES[s],
                EXTRA_FEATURES[t],
                EXTRA_FEATURES[l],
                EXTRA_FEATURES[a],
              )

              MARK[i] = features
            })
          })
        })
      })
    })
  })
})

// u$: { type: 'vowel', value: 'u$' },
// o$: { type: 'vowel', value: 'o$' },
// i: { type: 'vowel', value: 'i' },
// e: { type: 'vowel', value: 'e' },
// a: { type: 'vowel', value: 'a' },
// o: { type: 'vowel', value: 'o' },
// u: { type: 'vowel', value: 'u' },
// A: { type: 'vowel', value: 'A' },
// E: { type: 'vowel', value: 'E' },
// I: { type: 'vowel', value: 'I' },
// U: { type: 'vowel', value: 'U' },
// O: { type: 'vowel', value: 'O' },

export default function make(string: string) {
  let x = string
  const chunks: Array<Mark> = []
  let i = 0
  while (x.length) {
    let matched = false
    symbol: for (const key in MARK) {
      if (x.startsWith(key)) {
        const val = MARK[key]
        if (val && val.type) {
          chunks.push({ ...val })
        } else {
          // merge with previous....
          chunks[chunks.length - 1] = {
            ...chunks[chunks.length - 1],
            ...val,
          }
        }
        x = x.slice(key.length)
        i += key.length
        matched = true
        break symbol
      }
    }
    if (!matched) {
      console.error(string.slice(0, i))
      throw new Error('Invalid characters found')
    }
  }
  return demarcate(chunks)
}

type Slot = {
  base: number
  head: number
}

function demarcate(chunks: Array<Mark>) {
  let state = 'start'

  const slots: Array<Slot> = []
  let slot: Slot | undefined

  chunks.forEach((chunk, i) => {
    switch (state) {
      case 'start':
        switch (chunk.type) {
          case 'vowel':
            state = 'vowel'
            break
          default:
            break
        }
        break
      case 'vowel':
        switch (chunk.type) {
          case 'vowel': {
            const last = chunks[i - 1]
            switch (last && last.value) {
              case 'i':
                switch (chunk.value) {
                  case 'U':
                  case 'u':
                  case 'o':
                  case 'a':
                  case 'e':
                  case 'A':
                  case 'E':
                    slot = { base: i - 1, head: i - 1 }
                    slots.push(slot)
                    break
                  default:
                    break
                }
              case 'o':
                switch (chunk.value) {
                  case 'a':
                  case 'A':
                    slot = { base: i - 1, head: i - 1 }
                    slots.push(slot)
                    break
                  default:
                    break
                }
              case 'u$':
                slot = { base: i, head: i }
                slots.push(slot)
                break
              default:
                break
            }
            break
          }
          case 'consonant':
            state = 'consonant'
            slot = { base: i, head: i }
            slots.push(slot)
            break
          default:
            break
        }
        break
      case 'consonant':
        switch (chunk.type) {
          case 'vowel':
            state = 'vowel'
            break
          case 'consonant':
            switch (chunk.value) {
              case 'l':
              case 'L':
              case 'R':
              case 'r':
              case 'w':
              case 'y':
                assert(slot)
                slot.head = i - 1
                slot = undefined
                state = 'consonant'
                break
              default:
                state = 'consonant'
                if (!slot) {
                  slot = { base: i, head: i }
                  slots.push(slot)
                }
                slot.base = slot.head = i
                break
            }
            break
          default:
            break
        }
        break
      default:
        break
    }
  })

  const size =
    !slots.length || slots[slots.length - 1]?.head !== chunks.length - 1
      ? slots.length + 1
      : slots.length

  const closed = size === slots.length

  if (!closed) {
    slots.push({ base: chunks.length - 1, head: chunks.length - 1 })
  }

  const prosody: Prosody = []
  let i = 0
  let syllable: Array<string> = []
  let chunk: Mark = chunks[0]!
  slots.forEach(slot => {
    syllable = []
    while (i <= slot.base) {
      chunk = chunks[i]!
      syllable.push(serialize(chunk))
      i++
    }
    const text = syllable.join('')
    prosody.push({
      text,
      stressed: !!text.match(/\^/) === true ? true : undefined,
      open: chunk.type === 'vowel' ? true : undefined,
    })
  })

  return prosody
}

export type Prosody = Array<Syllable>

export type Syllable = {
  text: string
  open?: boolean
  stressed?: boolean
}

function assert(x: unknown): asserts x {
  if (!x) {
    throw new Error('assertion failed')
  }
}

function serialize(mark: Mark) {
  const text: Array<string> = []
  if (mark.value) {
    text.push(mark.value)
  }
  if (mark.click) {
    text.push(`*`)
  }
  if (mark.dentalization) {
  }
  if (mark.ejection) {
    text.push(`!`)
  }
  if (mark.implosion) {
    text.push(`?`)
  }
  if (mark.nasalization) {
    text.push(`&`)
  }
  if (mark.tone) {
    switch (mark.tone) {
      case 'extra high':
        text.push(`++`)
        break
      case 'high':
        text.push(`+`)
        break
      case 'low':
        text.push(`-`)
        break
      case 'extra low':
        text.push(`--`)
        break
      case 'rising':
        text.push(`/`)
        break
      case 'rising 2':
        text.push(`//`)
        break
      case 'falling':
        text.push(`\\`)
        break
      case 'falling 2':
        text.push(`\\\\`)
        break
      case 'rising falling':
        text.push(`/\\`)
        break
      case 'falling rising':
        text.push(`\\/`)
        break
    }
  }
  if (mark.elongation) {
    text.push(`_`)
  }
  if (mark.truncation) {
    text.push('!')
  }
  if (mark.stress) {
    text.push(`^`)
  }
  if (mark.pharyngealization) {
    text.push(`Q~`)
  }
  if (mark.velarization) {
    text.push(`G~`)
  }
  if (mark.palatalization) {
    text.push(`y~`)
  }
  if (mark.labialization) {
    text.push(`w~`)
  }
  if (mark.aspiration) {
    text.push(`h~`)
  }
  if (mark.stop) {
    text.push(`.`)
  }
  if (mark.tense) {
    text.push(`@`)
  }
  if (mark.voicelessness) {
  }

  return text.join('')
}
