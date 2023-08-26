export const tokenize = (src: string) => {
  const operators = /==|&&|\|\||!=|[<>+*/=()]/
  const separators = /""|".[^"]*"| |\n|;|\/\/.*|{|}/

  const tokens = src
    .split(new RegExp(`(${separators.source}|${operators.source})`))
    .map((v) => v?.trim())
    .filter((v) => v && !v.startsWith('//'))

  for (let i = 0; i < tokens.length; i++) {
    if (['*', '/', '==', '!=', '<', '>'].includes(tokens[i])) {
      if (tokens[i - 1] !== ')') {
        tokens.splice(i - 1, 0, '(')
      } else {
        let j = i - 2
        let nest = 0
        for (; j >= -1; j--) {
          if (tokens[j] === ')') {
            nest++
          }
          if (tokens[j] === '(') {
            nest--
            if (nest === -1) {
              if (tokens[j - 1].match(/^[a-zA-Z0-9]+$/)) {
                if (!['if', 'elif', 'for', 'while'].includes(tokens[j - 1]))
                  tokens.splice(j - 1, 0, '(')
              } else {
                tokens.splice(j, 0, '(')
              }

              break
            }
          }
        }
      }
      i += 1

      if (tokens[i + 1] !== '(') {
        tokens.splice(i + 2, 0, ')')
      } else {
        let j = i + 2
        let nest = 0
        for (; j < tokens.length; j++) {
          if (tokens[j] === '(') {
            nest++
          }
          if (tokens[j] === ')') {
            nest--
            if (nest === -1) {
              tokens.splice(j, 0, ')')
              break
            }
          }
        }
      }
      i += 1
    }
  }

  return tokens
}
