import fs from 'fs'
import path from 'path'
import { clearInterceptResult, exec, getInterceptResult, setInterceptForTest } from './tools'
import { inputInterceptor } from './functions/input/node'

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

        if (data.startsWith('// NO_TEST' || '//NO_TEST')) {
          continue
        }

        inputInterceptor.length = 0
        const inputInterceptPath = filePath + '.input.txt'
        const inputIntercept = fs.existsSync(inputInterceptPath)
          ? fs.readFileSync(inputInterceptPath, 'utf8')
          : null
        if (inputIntercept) {
          inputInterceptor.push(...inputIntercept.split('\n'))
        }

        const assertionPath = filePath + '.output.txt'
        const assertion = fs.existsSync(assertionPath)
          ? fs.readFileSync(assertionPath, 'utf8')
          : null

        console.log(`test: ${file}`)
        if (!assertion) {
          console.warn('このテストには期待値がありません\n')
        }

        await exec(data)

        const trimmedResult = getInterceptResult().trim()

        if (assertion) {
          if (trimmedResult === assertion) {
            console.log('\x1b[32mOK\x1b[0m\n')
          } else {
            console.error(
              `\n\x1b[31m期待された結果と違う出力でした\n期待値:\n${assertion}\n結果:\n${trimmedResult}\x1b[0m\n`
            )
            process.exit(1)
          }
        }

        clearInterceptResult()
      }
    }

    console.log(`\x1b[32mすべてのテストを通過しました\x1b[0m\nEnd: ${new Date()}`)
  } catch (err) {
    console.error('Error:', err)
  }
}
