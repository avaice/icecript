import { functions } from './functions/functions'
import { inputForBrowser } from './functions/input/browser'
import { listenWebEvent } from './functions/libDom/listenWebEvent'
import { movePage } from './functions/libDom/movePage'
import { setTitle } from './functions/libDom/setTitle'
import { writeHtml } from './functions/libDom/writeHtml'
import { readTextForBrowser } from './functions/readText/browser'
import { exec } from './tools'

const setBrowserFunctions = (noDomFunctions?: boolean) => {
  // Browser実装依存のfunctions
  ;(functions as any)['input'] = inputForBrowser
  ;(functions as any)['readText'] = readTextForBrowser
  if (!noDomFunctions) {
    ;(functions as any)['writeHtml'] = writeHtml
    ;(functions as any)['movePage'] = movePage
    ;(functions as any)['setTitle'] = setTitle
    ;(functions as any)['listenWebEvent'] = listenWebEvent
  }
}

//exec
;(window as any).icecript = (src: string, flag?: any, noDomFunctions?: boolean) => {
  setBrowserFunctions(noDomFunctions)
  exec(src, flag)
}
