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

export const formatWheelDiameterRange = (value: number | string): string => {
  const diameters = String(value).match(/\d+(?:[.,]\d+)?/g) ?? []
  const normalizedDiameters = diameters.map(diameter => diameter.replace(',', '.'))

  if (normalizedDiameters.length >= 2) {
    return normalizedDiameters.map(diameter => `R${diameter}`).join('-')
  }

  const wheelDiameter = Number(normalizedDiameters[0] ?? value)

  if (Number.isFinite(wheelDiameter)) {
    return `R${wheelDiameter}-R${wheelDiameter + 3}`
  }

  return `R${value}`
}
