export const numberToPxOrString = (value: string | number): string => {
  if (typeof value === 'string') {
    return value
  }

  return value + 'px'
}
