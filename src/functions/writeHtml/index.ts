export const writeHtml = (selector: string, html: string) => {
  const dom = document.querySelector(selector)
  if (!dom) {
    return
  }
  dom.innerHTML = html
}
