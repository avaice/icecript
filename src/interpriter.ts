import { functions } from './functions/functions'
import { err } from './tools'

let vars: any = {}
export const getPointer = () => p
let p: number = 0

const judgeOpe = ['==', '&&', '>', '<', '!=', '||']
const reserved = ['true', 'false', 'monkey']

export const interpriter = async (tokens: string[]) => {
  vars = {}
  p = 0

  const processTokens = async (options?: { exprFlag?: boolean }) => {
    while (p < tokens.length) {
      const select = tokens[p]

      // コマンドか？
      // eslint-disable-next-line no-prototype-builtins
      if (functions.hasOwnProperty(select)) {
        return await callFunc(select as keyof typeof functions)
      }

      // 変数宣言か？
      if (select === 'var') {
        return await defineVar()
      }

      if (select === '(') {
        return await kakko()
      }

      // 条件分岐か？
      if (select === 'if') {
        return await ifFunc()
      }

      // Whileか？
      // if (select === 'while') {
      //   return await whileFunc()
      // }

      // 予約語か？
      if (reserved.includes(select)) {
        switch (select) {
          case 'true':
            return true
          case 'false':
            return false
          case 'monkey':
            return Math.random() > 0.5 ? true : false
          default:
            return err('System Error! 存在しない予約語')
        }
      }

      // 比較か？
      if (!options?.exprFlag && judgeOpe.includes(tokens[p + 1])) {
        return await judge()
      }

      // 四則演算か？
      if (!options?.exprFlag && ['+', '*', '/'].includes(tokens[p + 1])) {
        return await arithmetic()
      }

      // 変数代入か？
      if (tokens[p + 1] === '=') {
        return await assignVar()
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
      if (select.match(/^[0-9]?.?[0-9]/)) {
        return Number(select)
      }

      if (![',', '(', ')', ';'].includes(select) && !select.startsWith('//')) {
        return err(`${select}は定義されていない命令です！`)
      }

      p++
    }
  }

  const callFunc = async (fnStr: keyof typeof functions) => {
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
      const arg = await processTokens()
      if (arg !== undefined) {
        args.push(arg)
      }
      p++
    }
    if (tokens[p] !== ')') {
      err(`関数の終わりに ")" がありません`)
    }
    const result = await (functions[fnStr] as any)(...args)

    // p++

    return result
  }

  const defineVar = async () => {
    p++
    if (Object.keys(vars).includes(tokens[p])) {
      err(`宣言済みの変数 "${tokens[p]}" を再宣言することはできません`)
    }
    if (reserved.includes(tokens[p])) {
      err(`"${tokens[p]}" はシステムの予約語なので、変数には使えません`)
    }
    vars[tokens[p]] = undefined
    if (tokens[p + 1] !== '=') {
      p++
    }
  }

  const assignVar = async () => {
    p += 2
    const result = await processTokens()
    vars[tokens[p - 2]] = result
    p++
  }

  const arithmetic = async (leftArg?: number) => {
    const ope = tokens[p + 1]
    const left: any = leftArg ?? (await processTokens({ exprFlag: true }))
    p += 2
    const right: any = await processTokens()

    switch (ope) {
      case '+':
        return left + right
      case '*':
        return left * right
      case '/':
        return left / right
    }
  }

  const kakko = async () => {
    p++
    const result: any = await processTokens()
    p++
    return ['+', '*', '/'].includes(tokens[p + 1])
      ? await arithmetic(result)
      : judgeOpe.includes(tokens[p + 1])
      ? await judge(result)
      : result
  }

  const ifFunc = async (current?: boolean) => {
    const processer = async (process: boolean) => {
      let nest = 0
      p += 2
      while (nest >= 0) {
        if (tokens[p] === '{') {
          nest++
        } else if (tokens[p] === '}') {
          nest--
        } else {
          if (process) {
            await processTokens()
          }
        }
        p++
      }
    }
    p++
    const result = await processTokens()
    const judge = current ? false : result

    await processer(judge)

    if (tokens[p] === 'else') {
      await processer(current ? false : !judge)
    } else if (tokens[p] === 'elif') {
      await ifFunc(current ? true : judge)
    }
  }

  // const whileFunc = async () => {
  //   const processer = async (process: boolean) => {
  //     let nest = 0
  //     p += 2
  //     while (nest >= 0) {
  //       if (tokens[p] === '{') {
  //         nest++
  //       } else if (tokens[p] === '}') {
  //         nest--
  //       } else {
  //         if (process) {
  //           await processTokens()
  //         }
  //       }
  //       p++
  //     }
  //   }
  //   p++
  //   const startPointer = p
  //   const result = await processTokens()
  //   const judge = result

  //   await processer(judge)

  //   if (judge) {
  //     p = startPointer
  //     whileFunc()
  //   }
  // }

  const judge = async (leftArg?: any) => {
    const ope = tokens[p + 1]
    const left: any = leftArg ?? (await processTokens({ exprFlag: true }))
    p += 2
    const right: any = await processTokens()

    switch (ope) {
      case '==':
        return left == right
      case '&&':
        return left && right
      case '||':
        return !!(left || right)
      case '<':
        return left < right
      case '>':
        return left > right
      case '!=':
        return left != right
    }
  }

  while (p < tokens.length) {
    await processTokens()
  }
  // console.log(vars)
}
