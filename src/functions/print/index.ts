import { getInterceptForTest, printInterceptor } from '../../test'

export const print = (msg?: any, ...optionalMsg: any[]) => {
  if (getInterceptForTest()) {
    printInterceptor(msg, ...optionalMsg)
  } else {
    console.log(msg, ...optionalMsg)
  }
  return
}
