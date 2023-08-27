import { err } from '../../tools'

export const parse = (to: 'number' | 'string' | 'int' | 'float', value: any) => {
  if (to === 'int') {
    return parseInt(value)
  }
  if (to === 'float') {
    return parseFloat(value)
  }
  if (to === 'number') {
    return Number(value)
  }
  if (to === 'string') {
    return value.toString()
  }
  err(`${to}には変換できません`)
}
