export const formatPrice = (value: number | string): string => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue)) {
    return 'По запросу'
  }

  return `$ ${numberValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}
