import { parse } from './parse/parse'
import { print } from './print'
import { random } from './random'
import { split } from './string/split'

// Node版, Browser版に関わらず存在するやつ
export const functions = {
  print,
  random,
  parse,
  split,
}
