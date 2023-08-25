import { functions } from './functions/functions'
import { inputForBrowser } from './functions/input/browser'
import { exec } from './tools'

// Browser実装依存のfunctions
;(functions as any)['input'] = inputForBrowser

//exec
;(window as any).icecript = exec
