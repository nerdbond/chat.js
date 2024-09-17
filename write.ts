import { CONSONANTS, VOWELS } from '~/make/talk'
import talkToIpa from '~/make/talk/ipa'
import { m } from '~/make/constants'

console.log(
  CONSONANTS.map(({ i, o }) => {
    return `| ${talkToIpa(i)} | ${i} | ${o} |`
  }).join('\n'),
)

console.log('')

console.log(
  VOWELS.filter(
    ({ i }) =>
      i.match(/a/) &&
      !i.match(new RegExp(`a${m.d.dot}`)) &&
      !i.match(new RegExp(`\\$`)),
  )
    .sort((a, b) => a.o.localeCompare(b.o))
    .map(({ i, o }) => {
      return `| ${talkToIpa(i)} | ${i} | ${o} |`
    })
    .join('\n'),
)
