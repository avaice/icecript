import readline from 'readline'

export const inputInterceptor: string[] = []

export const inputForNode = (message?: string) =>
  new Promise((resolve) => {
    const question = message + ': ' ?? ''

    if (inputInterceptor.length > 0) {
      return resolve(inputInterceptor.shift())
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
