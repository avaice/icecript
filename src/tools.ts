import { getPointer, interpriter } from './interpriter'
import { tokenize } from './tokenize'

let tokens: string[]

export const enviroment = typeof window === 'undefined' ? 'node' : 'browser'

export const err = (message: string) => {
  const p = getPointer()
  const pos = tokens.slice(Math.max(0, p - 5), p + 5).join(' ')
  if (enviroment === 'browser') {
    alert(
      `Error: ${p}
      該当コード近辺: ${pos}
      ${message}`
    )
    throw new Error(message)
  } else {
    throw new Error(`\x1b[31m${message}\n${p}: ${pos}\x1b[0m`)
  }
}

export const exec = async (src: string) => {
  tokens = tokenize(src)

  // tokens.forEach((v, i) => {
  //   console.log(i, v)
  // })

  await interpriter(tokens)
}
