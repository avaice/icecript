import readline from 'readline'

export const inputForNode = (message?: string) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.question(message + ': ' ?? '', (response) => {
      rl.close()
      resolve(response)
    })
  })
