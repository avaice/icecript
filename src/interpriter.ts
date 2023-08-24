import { functions } from './functions/functions'
import { err } from './tools'

const vars: any = {}

export const interpriter = (tokens: string[]) => {
  let p = 0

  const processTokens = (options?: { exprFlag?: boolean }) => {
    while (p < tokens.length) {
      const select = tokens[p]

      // コマンドか？
      // eslint-disable-next-line no-prototype-builtins
      if (functions.hasOwnProperty(select)) {
        return callFunc(select as keyof typeof functions)
      }

      // 変数宣言か？
      if (select === 'var') {
        return defineVar()
      }

      if (select === '(') {
        return kakko()
      }

      // 四則演算か？
      if (!options?.exprFlag && ['+', '-', '*', '/'].includes(tokens[p + 1])) {
        return arithmetic()
      }

      // 変数代入か？
      if (tokens[p + 1] === '=') {
        return assignVar()
      }

      // 変数呼び出しか？
      if (Object.keys(vars).includes(tokens[p])) {
        return vars[tokens[p]]
      }

      // ただの文字か？
      if (select.match(/".*"/)) {
        return select.slice(1, select.length - 1)
      }

      // 数字か？
      if (select.match(/[0-9]?.?[0-9]/)) {
        return Number(select)
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
    const result = (functions[fnStr] as any)(...args)

    p++

    return result
  }

  const defineVar = () => {
    p++
    if (Object.keys(vars).includes(tokens[p])) {
      err(`宣言済みの変数 "${tokens[p]}" を再宣言することはできません`)
    }
    vars[tokens[p]] = undefined
  }

  const assignVar = () => {
    p += 2

    vars[tokens[p - 2]] = processTokens()
    p++
  }

  const arithmetic = (leftArg?: number) => {
    const ope = tokens[p + 1]
    const left: any = leftArg ?? processTokens({ exprFlag: true })
    p += 2
    const right: any = processTokens()

    switch (ope) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return left / right
    }
  }

  const kakko = () => {
    p++
    const result: any = processTokens()
    p++
    return ['+', '-', '*', '/'].includes(tokens[p + 1]) ? arithmetic(result) : result
  }

  while (p < tokens.length) {
    processTokens()
  }
  // console.log(vars)
}
