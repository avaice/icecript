let iceScriptCode
let entryPoint

const render = (noPush) => {
    const urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get('id')
    const href = location.href
    if (!id) {
        id = 'top'
    }
    icecript({ src: iceScriptCode, flag: ['render', id, noPush], useDomFunctions: true })
}

document.addEventListener('DOMContentLoaded', async () => {
    entryPoint = location.href
    const scriptArray = []
    const iceScriptElement = document.querySelectorAll('script[type="text/icecript"]')

    for (let i = 0; i < iceScriptElement.length; i++) {
        const src = iceScriptElement[i].textContent ? iceScriptElement[i].textContent : await fetch(iceScriptElement[i].src).then((v) => v.text())
        scriptArray.push(src)
    }

    iceScriptCode = scriptArray.join('\n')
    render(true)
})
window.addEventListener('popstate', (e) => {
    render(true)
})