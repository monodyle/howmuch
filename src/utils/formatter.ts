export const currencyFormatter = (number: string): string => {
  if (!number) return '$0'
  let input: string[] = number.split('.')
  input[0] = input[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
  input[1] = input[1].replace(/0{1,}$/, '')
  return '$' + input.join('.')
}
