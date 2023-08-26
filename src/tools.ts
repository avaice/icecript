import { getPointer, interpriter } from './interpriter'
import { tokenize } from './tokenize'

let tokens: string[]

export const enviroment = typeof window === 'undefined' ? 'node' : 'browser'

export const err = (message: string) => {
  if (enviroment === 'browser') {
    const p = getPointer()
    const pos = tokens.slice(Math.max(0, p - 5), p + 5).join(' ')
    alert(
      `Error: ${p}
      該当コード近辺: ${pos}
      ${message}`
    )
    throw new Error(message)
  } else {
    throw new Error(`\x1b[31m${message}\x1b[0m`)
  }
}

export const exec = async (src: string) => {
  tokens = tokenize(src)
  // console.log(tokens)
  await interpriter(tokens)
}
