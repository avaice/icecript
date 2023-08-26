import readline from 'readline'
import { getInterceptForTest } from '../../tools'

export const inputForNode = (message?: string) =>
  new Promise((resolve) => {
    const question = message + ': ' ?? ''

    if (getInterceptForTest()) {
      const placeHolder = 'test'
      // console.log(question + placeHolder)
      resolve(placeHolder)
      return
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(question, (response) => {
      rl.close()
      resolve(response)
    })
  })
