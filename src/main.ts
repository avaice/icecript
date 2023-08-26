import { functions } from './functions/functions'
import { inputForNode } from './functions/input/node'
import { err, exec } from './tools'
import fs from 'node:fs'
import { test } from './test'

// Node実装依存のfunctions
;(functions as any)['input'] = inputForNode

try {
  const args = process.argv.slice(2)

  if (args[0] === '--test') {
    console.log(`Test mode!\nStart: ${new Date()}\n`)
    test()
  } else {
    const filePath = args[0]
    if (!filePath) {
      err('引数にソースコードを指定してください！')
    } else {
      if (!fs.existsSync(filePath)) {
        err('ソースコードが見つかりませんでした')
      } else {
        const src = fs.readFileSync(filePath, 'utf8')
        exec(src)
      }
    }
  }
} catch (e) {
  console.error((e as object).toString())
}
