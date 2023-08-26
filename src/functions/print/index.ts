import { getInterceptForTest, printInterceptor } from '../../tools'

export const print = (msg?: any, ...optionalMsg: any[]) => {
  if (getInterceptForTest()) {
    printInterceptor(msg, ...optionalMsg)
  } else {
    console.log(msg, ...optionalMsg)
  }
  return
}
