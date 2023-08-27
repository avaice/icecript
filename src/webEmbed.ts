import { functions } from './functions/functions'
import { inputForBrowser } from './functions/input/browser'
import { listenWebEvent } from './functions/listenWebEvent'
import { writeHtml } from './functions/writeHtml'
import { exec } from './tools'

// Browser実装依存のfunctions
;(functions as any)['input'] = inputForBrowser
;(functions as any)['writeHtml'] = writeHtml
;(functions as any)['listenWebEvent'] = listenWebEvent

//exec
;(window as any).icecript = exec
