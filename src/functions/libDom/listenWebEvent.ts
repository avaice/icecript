import { exec } from '../../tools'

export const listenWebEvent = (selector: string, event: string, flag: string) => {
  const dom = document.querySelector(selector)
  if (!dom) {
    return false
  }
  return dom.addEventListener(event, () => {
    exec(undefined, flag)
  })
}
