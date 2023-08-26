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
        console.log(`test: ${file}`)
        await exec(data)
        console.log(result.trim() + '\n')
        result = ''
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
