export const inputForBrowser = (message?: string) => {
  return window.prompt(message) ?? ''
}
