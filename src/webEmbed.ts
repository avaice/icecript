import { functions } from './functions/functions'
import { inputForBrowser } from './functions/input/browser'
import { listenWebEvent } from './functions/libDom/listenWebEvent'
import { movePage } from './functions/libDom/movePage'
import { writeHtml } from './functions/libDom/writeHtml'
import { readTextForBrowser } from './functions/readText/browser'
import { exec } from './tools'

// Browser実装依存のfunctions
;(functions as any)['input'] = inputForBrowser
;(functions as any)['writeHtml'] = writeHtml
;(functions as any)['movePage'] = movePage
;(functions as any)['listenWebEvent'] = listenWebEvent
;(functions as any)['readTextForBrowser'] = readTextForBrowser

//exec
;(window as any).icecript = exec
