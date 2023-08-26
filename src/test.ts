import fs from 'fs'
import path from 'path'
import { exec } from './tools'

let result = ''
let interceptForTest = false
export const getInterceptForTest = () => interceptForTest
export const setInterceptForTest = (flag: boolean) => (interceptForTest = flag)
export const printInterceptor = (msg?: any, ...optionalMsg: any[]) => {
  result = result + [msg, ...optionalMsg].join(' ') + '\n'
  return
}
export const test = async () => {
  // 出力を迎撃する
  setInterceptForTest(true)

  try {
    const directoryPath = 'samples/'
    const files = fs.readdirSync(directoryPath)

    for (const file of files) {
      if (path.extname(file) === '.ic') {
        const filePath = path.join(directoryPath, file)
        const data = fs.readFileSync(filePath, 'utf8')
        const assertionPath = filePath + '.txt'
        const assertion = fs.existsSync(assertionPath)
          ? fs.readFileSync(assertionPath, 'utf8')
          : null

        console.log(`test: ${file}`)
        if (!assertion) {
          console.warn('このテストには期待値がありません\n')
        }

        await exec(data)

        const trimmedResult = result.trim()

        if (assertion) {
          if (trimmedResult === assertion) {
            console.log('\x1b[32mOK\x1b[0m\n')
          } else {
            return console.error(
              `\n\x1b[31m期待された結果と違う出力でした\n期待値:\n${assertion}\n結果:\n${trimmedResult}\x1b[0m\n`
            )
          }
        }

        result = ''
      }
    }

    console.log(`\x1b[32mすべてのテストに通過しました\x1b[0m\nEnd: ${new Date()}`)
  } catch (err) {
    console.error('Error:', err)
  }
}
