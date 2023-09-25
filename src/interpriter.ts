import { functions } from './functions/functions'
import { enviroment, err } from './tools'

let vars: any = {}
let scopedVars: any = {}
let p: number = 0
export const getPointer = () => p

const judgeOpe = ['==', '&&', '>', '<', '>=', '<=', '!=', '||']
const reserved = ['true', 'false', 'monkey', 'void', 'flag']

const breakSym = Symbol('break')

type returnObjType = { sym: typeof breakSym; value: any }

export const interpriter = async (tokens: string[], flag: string = 'initial') => {
  vars = {}
  scopedVars = {}
  p = 0

  const processTokens = async (options: {
    exprFlag?: boolean
    scopedVariables: any
  }): Promise<any> => {
    while (p < tokens.length) {
      const select = tokens[p]

      // コマンドか？
      // eslint-disable-next-line no-prototype-builtins
      if (functions.hasOwnProperty(select)) {
        return await callInternalFunc(select as keyof typeof functions, options.scopedVariables)
      }

      // 関数呼び出しか？
      if (vars[select]?.type === 'function') {
        return await callFunc()
      }

      // 変数宣言か？
      if (select === 'var') {
        return await defineVar(options.scopedVariables)
      }

      if (select === '(') {
        return await kakko(options.scopedVariables)
      }
      if (select === '[') {
        return await array(options.scopedVariables)
      }

      // 条件分岐か？
      if (select === 'if') {
        return await ifFunc({ scopedVariables: options.scopedVariables })
      }

      // 関数宣言か？
      if (select === 'fn') {
        if (options.scopedVariables) {
          err('関数内で関数を宣言することはできません！')
        }
        return await defineFn()
      }

      // Whileか？
      if (select === 'while') {
        return await whileFunc(options.scopedVariables)
      }

      // 予約語か？
      if (reserved.includes(select)) {
        switch (select) {
          case 'true':
            return true
          case 'false':
            return false
          case 'monkey':
            return Math.random() > 0.5 ? true : false
          case 'flag':
            return flag
          default:
            return err('System Error! 存在しない予約語')
        }
      }

      // 比較か？
      if (!options?.exprFlag && judgeOpe.includes(tokens[p + 1])) {
        return await judge({ scopedVariables: options.scopedVariables })
      }

      // 四則演算か？
      if (!options?.exprFlag && ['+', '*', '/'].includes(tokens[p + 1])) {
        return await arithmetic({ scopedVariables: options.scopedVariables })
      }

      // 変数代入か？
      if (tokens[p + 1] === '=') {
        return await assignVar(options.scopedVariables)
      }

      // ローカル変数呼び出しか？
      if (options.scopedVariables) {
        if (Object.keys(options.scopedVariables).includes(tokens[p])) {
          return await getVariable(true, options.scopedVariables)
        }
      }

      // 変数呼び出しか？
      if (Object.keys(vars).includes(tokens[p])) {
        return await getVariable(false, options.scopedVariables)
      }

      // ただの文字か？
      if (select.match(/".*"/) || select.match(/`([^`]+)`/)) {
        return select.slice(1, select.length - 1)
      }

      // 数字か？
      if (select.match(/^[0-9]?.?[0-9]/)) {
        return Number(select)
      }

      // ポインター移動バグのせいで必要
      if (select === '}' || select === ']') {
        return
      }

      // ブレークコマンドか？
      if (select === 'return') {
        if (tokens[p + 1] === 'void') {
          return {
            sym: breakSym,
            value: undefined,
          }
        }
        p++
        return {
          sym: breakSym,
          value: await processTokens({ scopedVariables: options.scopedVariables }),
        }
      }

      if (![',', '(', ')', ';', 'void'].includes(select) && !select.startsWith('//')) {
        return err(`${select}は定義されていない命令です！`)
      }

      p++
    }
  }

  const callInternalFunc = async (fnStr: keyof typeof functions, scopedVariables: any) => {
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
      const arg = await processTokens({ scopedVariables })
      if (arg !== undefined) {
        args.push(arg)
      }

      p++
    }
    if (tokens[p] !== ')') {
      err(`関数の終わりに ")" がありません`)
    }
    const result = await (functions[fnStr] as any)(...args)
    return ['+', '*', '/'].includes(tokens[p + 1])
      ? await arithmetic({ leftArg: result, scopedVariables })
      : judgeOpe.includes(tokens[p + 1])
      ? await judge({ leftArg: result, scopedVariables })
      : result
  }

  const defineVar = async (scopedVariables?: any) => {
    p++
    if (reserved.includes(tokens[p])) {
      err(`"${tokens[p]}" はシステムの予約語なので、変数には使えません`)
    }

    if (scopedVariables) {
      if (Object.keys(scopedVariables).includes(tokens[p])) {
        err(`宣言済みの変数 "${tokens[p]}" を再宣言することはできません`)
      }
      scopedVariables[tokens[p]] = undefined
    } else {
      if (Object.keys(vars).includes(tokens[p])) {
        err(`宣言済みの変数 "${tokens[p]}" を再宣言することはできません`)
      }

      vars[tokens[p]] = undefined
    }

    if (tokens[p + 1] !== '=') {
      p++
    }
  }

  const defineFn = async () => {
    p++
    // eslint-disable-next-line no-prototype-builtins
    if (Object.keys(vars).includes(tokens[p]) || functions.hasOwnProperty(tokens[p])) {
      err(`宣言済みの変数 "${tokens[p]}" を再宣言することはできません`)
    }
    if (reserved.includes(tokens[p])) {
      err(`"${tokens[p]}" はシステムの予約語なので、変数には使えません`)
    }

    const fnName = tokens[p]
    vars[fnName] = { type: 'function', args: [], pointer: null }

    p++
    if (tokens[p] !== '(') {
      err('関数の引数宣言がありません')
    }
    p++
    while (tokens[p] !== ')') {
      if (tokens[p] !== ',') {
        vars[fnName].args.push(tokens[p])
      }
      p++
    }
    p++
    vars[fnName].pointer = p
    processor(false, undefined)

    return
  }

  const callFunc = async () => {
    const fnName = tokens[p]
    const sym = Symbol(fnName)
    scopedVars[sym] = {}
    const scoped = scopedVars[sym]
    p++
    if (tokens[p] !== '(') {
      err('関数の引数宣言がありません')
    }
    let i = 0
    p++
    while (tokens[p] !== ')') {
      if (tokens[p] !== ',') {
        scoped[vars[fnName].args[i]] = await processTokens({ scopedVariables: undefined })
        i++
      }

      p++
    }

    const from = p
    p = vars[fnName].pointer
    const result = await processor(true, scoped)
    p = from
    // 関数が終わる前にローカル変数を削除する
    delete scopedVars[sym]

    return result?.value
  }

  const assignVar = async (scopedVariables: any) => {
    const varPoint = p
    p += 2
    const result = await processTokens({ scopedVariables })
    if (scopedVariables && Object.keys(scopedVariables).includes(tokens[varPoint])) {
      scopedVariables[tokens[varPoint]] = result
    } else {
      vars[tokens[varPoint]] = result
    }

    p++
  }

  const arithmetic = async ({
    leftArg,
    scopedVariables,
  }: {
    leftArg?: number
    scopedVariables: any
  }) => {
    const ope = tokens[p + 1]
    const left: any = leftArg ?? (await processTokens({ exprFlag: true, scopedVariables }))
    p += 2
    const right: any = await processTokens({ scopedVariables })

    switch (ope) {
      case '+':
        return left + right
      case '*':
        return left * right
      case '/':
        return left / right
    }
  }

  const kakko = async (scopedVariables: any) => {
    p++
    const result: any = await processTokens({ scopedVariables })
    p++
    return ['+', '*', '/'].includes(tokens[p + 1])
      ? await arithmetic({ leftArg: result, scopedVariables })
      : judgeOpe.includes(tokens[p + 1])
      ? await judge({ leftArg: result, scopedVariables })
      : result
  }

  const array = async (scopedVariables: any) => {
    const newArr = []
    p++
    while (tokens[p] !== ']') {
      if (tokens[p] !== ',') {
        const result: any = await processTokens({ scopedVariables })
        newArr.push(result)
      }
      p++
    }

    return newArr
  }

  const getVariable = async (isLocalVar: boolean, scopedVariables: any) => {
    const selectedVar = isLocalVar ? scopedVariables[tokens[p]] : vars[tokens[p]]
    if (Array.isArray(selectedVar) && tokens[p + 1] === '[') {
      p += 2
      const index = await processTokens({ scopedVariables })
      if (isNaN(index)) {
        console.log(typeof index)
        err('配列のインデックスに数値ではないものが指定されました！' + index)
      }
      p++

      const result = selectedVar[Number(index)]

      return ['+', '*', '/'].includes(tokens[p + 1])
        ? await arithmetic({ leftArg: result, scopedVariables })
        : judgeOpe.includes(tokens[p + 1])
        ? await judge({ leftArg: result, scopedVariables })
        : result
    } else {
      return selectedVar
    }
  }

  const ifFunc = async ({
    current,
    scopedVariables,
  }: {
    current?: boolean
    scopedVariables: any
  }): Promise<{ sym: typeof breakSym } | undefined> => {
    p++
    const result = await processTokens({ scopedVariables })
    const judge = current ? false : result
    p++
    const isReturned = await processor(judge, scopedVariables)

    if (tokens[p] === 'else') {
      p++
      return await processor(current ? false : !judge, scopedVariables)
    } else if (tokens[p] === 'elif') {
      return await ifFunc({ current: current ? true : judge, scopedVariables })
    }

    return isReturned
  }

  const whileFunc = async (scopedVariables: any): Promise<returnObjType | undefined> => {
    const startPointer = p
    p++
    const result = await processTokens({ scopedVariables })
    const judge = !!result
    p++
    const isReturned = await processor(judge, scopedVariables)

    if (judge && !isReturned) {
      p = startPointer
      return await whileFunc(scopedVariables)
    }
    return isReturned
  }

  const judge = async ({ leftArg, scopedVariables }: { leftArg?: any; scopedVariables: any }) => {
    const ope = tokens[p + 1]
    const left: any = leftArg ?? (await processTokens({ exprFlag: true, scopedVariables }))
    p += 2
    const right: any = await processTokens({ scopedVariables })
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
      case '<=':
        return left <= right
      case '>=':
        return left >= right
      case '!=':
        return left != right
    }
  }

  // 括弧の中を処理するやつ。
  //（process === falseだと処理しないでポインタだけ動かしてくれる）
  const processor = async (process: boolean, scopedVariables: any) => {
    let nest = 0
    let returned = undefined

    // eslint-disable-next-line no-constant-condition
    while (p < tokens.length) {
      if (tokens[p] === '{') {
        nest++
      } else if (tokens[p] === '}') {
        nest--
        if (nest === 0) {
          break
        }
      } else {
        if (process && !returned) {
          const result = await processTokens({ scopedVariables })
          if (result?.sym === breakSym) {
            returned = result as returnObjType
          }
          // processTokens() の先ですでにポインタを動かしているので、
          // 下のp++と合わせると二重になってしまう
          p--
        }
      }
      p++
    }
    p++
    return returned
  }

  while (p < tokens.length) {
    await processTokens({ scopedVariables: undefined })
  }
  if (enviroment === 'node') {
    console.log(vars)
  }
}
