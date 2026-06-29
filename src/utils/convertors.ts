export const numberToPxOrString = (value: string | number): string => {
  if (typeof value === 'string') {
    return value
  }

  return value + 'px'
}

export const formatUsd = (value: number): string => {
  return `$ ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}
