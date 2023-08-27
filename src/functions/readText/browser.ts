export const readTextForBrowser = async (path: string) => {
  return await fetch(path).then((v) => v.text())
}
