import { interpriter } from './interpriter'
import { tokenize } from './tokenize'

export const err = (message: string) => {
  throw new Error(`\x1b[31m${message}\x1b[0m`)
}

export const exec = (src: string) => {
  const tokens = tokenize(src)
  interpriter(tokens)
}
