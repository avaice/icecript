export const tokenize = (src: string) => {
  return src
    .split(/(".[^"]*"|print|\(|\))|\n|;/)
    .map((v) => v?.trim())
    .filter((v) => v)
}
