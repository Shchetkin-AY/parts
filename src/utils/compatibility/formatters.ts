import { CompatibilityEntry } from '../interfaces'

const emptyPlatform = new Set([ '-', '—' ])

export const formatYears = (item: CompatibilityEntry): string => {
  const { yearFrom, yearTo } = item

  if (yearFrom == null && yearTo == null) {
    return '—'
  }

  if (yearFrom != null && yearTo != null) {
    if (yearFrom === yearTo) {
      return String(yearFrom)
    }

    return `${yearFrom}–${yearTo}`
  }

  if (yearFrom != null) {
    return `с ${yearFrom}`
  }

  return `по ${yearTo}`
}

export const formatPlatform = (item: CompatibilityEntry): string => {
  const value = item.platform?.trim()

  if (!value || emptyPlatform.has(value)) {
    return ''
  }

  return value.replace(/,\s*/g, ' · ')
}

export const formatWheel = (item: CompatibilityEntry): string => {
  if (item.wheelInch == null) {
    return '—'
  }

  return `от R${item.wheelInch}″`
}

export const getResultName = (entry: CompatibilityEntry): string => {
  const platform = formatPlatform(entry)
  const years = formatYears(entry)

  const parts: string[] = [ entry.brand, entry.model ]

  if (platform) {
    parts.push(platform)
  }

  if (years !== '—') {
    parts.push(`(${years})`)
  }

  return parts.filter(Boolean).join(' ')
}
