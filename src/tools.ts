import { getPointer, interpriter } from './interpriter'
import { tokenize } from './tokenize'

let cache = ''

let tokens: string[]

let interceptForTest = false
let result = ''
export const getInterceptResult = () => result
export const clearInterceptResult = () => (result = '')
export const getInterceptForTest = () => interceptForTest
export const setInterceptForTest = (flag: boolean) => (interceptForTest = flag)
export const printInterceptor = (msg?: any, ...optionalMsg: any[]) => {
  result = result + [msg, ...optionalMsg].join(' ') + '\n'
  return
}

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

export const exec = async (src: string | undefined, flag?: any) => {
  if (!src) {
    src = cache
  } else {
    cache = src
  }
  tokens = tokenize(src)

  // console.log(tokens)

  // tokens.forEach((v, i) => {
  //   console.log(i, v)
  // })

  await interpriter(tokens, flag)
}
