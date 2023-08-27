import { exec } from '../../tools'

export const writeHtml = (selector: string, html: string) => {
  const dom = document.querySelector(selector)
  if (!dom) {
    return
  }
  dom.innerHTML = html
  const aTags = dom.getElementsByTagName('a')
  for (const aTag of aTags) {
    const href = aTag.href
    const url = new URL(href)
    const urlParams = new URLSearchParams(url.search)
    const id = urlParams.get('id')
    console.log(href, id)
    if (href.includes(location.href) && id) {
      aTag.addEventListener('click', (e) => {
        e.preventDefault()
        exec(undefined, id)
      })
    }
  }
}
