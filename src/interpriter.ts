import { functions } from './functions/functions'
import { err } from './tools'

export const interpriter = (tokens: string[]) => {
  let p = 0

  const processTokens = () => {
    while (p < tokens.length) {
      const select = tokens[p]

      // コマンドか？
      // eslint-disable-next-line no-prototype-builtins
      if (functions.hasOwnProperty(select)) {
        return callFunc(select as keyof typeof functions)
      }

      // ただの文字か？
      if (select.match(/".*"/)) {
        return select.slice(1, select.length - 1)
      }

      if (![',', '(', ')', ';'].includes(select)) {
        return err(`${select}は定義されていない命令です！`)
      }

      p++
    }
  }

  const callFunc = (fnStr: keyof typeof functions) => {
    p++
    if (tokens[p] !== '(') {
      err(`関数の始めに "(" がありません`)
    }

    p++
    const args = [] as any
    while (p < tokens.length) {
      if (tokens[p] === ')') {
        break
      }
      const arg = processTokens()
      if (arg) {
        args.push(arg)
      }
      p++
    }
    if (tokens[p] !== ')') {
      err(`関数の終わりに ")" がありません`)
    }
    functions[fnStr](...args)

    p++
  }

  while (p < tokens.length) {
    processTokens()
  }
}
