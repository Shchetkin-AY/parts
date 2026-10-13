import { CatalogItem } from '../interfaces'

export const numberToPxOrString = (value: string | number): string => {
  if (typeof value === 'string') {
    return value
  }

  return value + 'px'
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
})

export const formatPrice = (value: number): string => {
  if (!value) {
    return 'По запросу'
  }

  return priceFormatter.format(value).replace(/,/g, '.')
}

const extractDiameters = (value: number | string): number[] => {
  return (String(value).match(/\d+(?:[.,]\d+)?/g) ?? [])
    .map(diameter => Number(diameter.replace(',', '.')))
    .filter(Number.isFinite)
}

export const formatWheelDiameter = (value: number | string): string => {
  return `R${value}`
}

/**
 * Возвращает диапазон диаметров колёс в формате "R12-R15" или "R15",
 * если диаметр всего один.
 *
 * Принимает либо строку/число одного товара (item.wheelDiameter),
 * либо массив CatalogItem — тогда диапазон строится по всем товарам вместе
 * (например, по всем SKU одной серии).
 */
export const getWheelDiameterRange = (source: number | string | CatalogItem[]): string => {
  const diameters = Array.isArray(source)
    ? source.flatMap(item => extractDiameters(item.wheelDiameter))
    : extractDiameters(source)

  if (diameters.length === 0) {
    return ''
  }

  const min = Math.min(...diameters)
  const max = Math.max(...diameters)

  return min === max ? `от ${formatWheelDiameter(min)}` : `${formatWheelDiameter(min)} - ${formatWheelDiameter(max)}`
}
